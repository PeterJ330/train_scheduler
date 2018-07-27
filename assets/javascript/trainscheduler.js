// Initialize Firebase
var config = {
  apiKey: "AIzaSyB5m0YBJ0J4tVmQ904oq5vJK3Dke_Gq_Rk",
  authDomain: "trainscheduler-9a283.firebaseapp.com",
  databaseURL: "https://trainscheduler-9a283.firebaseio.com",
  projectId: "trainscheduler-9a283",
  storageBucket: "trainscheduler-9a283.appspot.com",
  messagingSenderId: "186370673105"
};
firebase.initializeApp(config);
var database = firebase.database();
//======================================================================================================//
var name = "";
var destination = "";
var firstTrain = "";
var frequency = "";
var nextArrival = "";
var minutesAway = "";
var arrivalTime = "";

$("#add-train").on("click", function (event) {
  event.preventDefault();

  name = $("#nameInput").val().trim();
  destination = $("#destInput").val().trim();
  firstTrain = $("#firstTrainInput").val().trim();
  frequency = $("#freqInput").val().trim();

  calculateVariables();
  
  database.ref().push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });//closes push
});//closes .onClick

database.ref().on("child_added", function (childSnapshot) {
var cs = childSnapshot.val()
  console.log(cs.name);
  console.log(cs.destination);
  console.log(cs.firstTrain);
  console.log(cs.nextArrival);
  console.log(cs.minutesAway);

  $("#nameDisplay").append(cs.name);
  $("#destDisplay").append(cs.destination);
  $("#freqDisplay").append(cs.frequency);
  $("#arrivalDisplay").append(cs.nextArrival);
  $("#minDisplay").append(cs.minutesAway);

  $("#nameInput").val("");
  $("#destInput").val("");
  $("#firstTrainInput").val("");
  $("#freqInput").val("");
      
}, function(errorObject) {
console.log("Errors handled: " + errorObject.code);
});

function calculateVariables() {

  var timeConvert = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(timeConvert);
  var currentTime = moment();
  console.log("Current Time: " + moment(currentTime).format("HH:mm"));
  var timeDiff = moment().diff(moment(timeConvert), "minutes");
  console.log("Time Diff: " + timeDiff);
  var remainder = timeDiff % frequency;
  console.log(remainder);
  var timeToTrain = frequency - remainder; 
  console.log("Min until Train: " + timeToTrain);
  var nextTrain = moment().add(timeToTrain, "minutes");
  console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"))

  nextArrival = moment(nextTrain).format("hh:mm");
  minutesAway = timeToTrain;
  

  console.log(name);
  console.log(destination);
  console.log(firstTrain);
  console.log(nextArrival);
  console.log(minutesAway);
};