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
var updatedNextArrival = "";
var newMinutesAway = "";
var currentTime = moment();


// $(document).ready(clock);

function clock() {
  $("#clock").text(moment().format('LL'));
  $("#clock").append(" - ");
  $("#clock").append(moment().format('HH:mm:ss'));
  setTimeout("clock()",1000);

};
clock();


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

  function recalculateVariables() {
    var timeConvert = moment(cs.firstTrain, "HH:mm:ss").subtract(1, "years");
    var timeDiff = moment().diff(moment(timeConvert), "minutes");
    var remainder = timeDiff % cs.frequency;
    minutesLeft = cs.frequency - remainder;
    var nextTrain = moment().add(minutesLeft, "minutes");
    console.log(moment(nextTrain).format("X"));
    updatedNextArrival = moment(nextTrain).format("HH:mm");
    console.log(updatedNextArrival);
    newMinutesAway = moment(nextTrain).diff(moment(), "minutes")
    console.log(moment(nextTrain).diff(moment(), "minutes"))
    console.log(newMinutesAway);


  };

  $("#nameDisplay").append("<div class='nameAdd'>" + cs.name);
  $("#destDisplay").append("<div class='destAdd'>" + cs.destination);
  $("#freqDisplay").append("<div class='freqAdd'>" + cs.frequency);
  if (moment().format("HH:mm") >= cs.nextArrival) {
    recalculateVariables();
    $("#arrivalDisplay").append("<div class='arrivalAdd'>" + updatedNextArrival);
    $("#minDisplay").append("<div class='minAdd'>" + newMinutesAway);
  } else {
    $("#arrivalDisplay").append("<div class='arrivalAdd'>" + cs.nextArrival);
    $("#minDisplay").append("<div class='minAdd'>" + cs.minutesAway);
  }
  // $("#minDisplay").append("<div class='minAdd'>" + cs.minutesAway);

  $("#nameInput").val("");
  $("#destInput").val("");
  $("#firstTrainInput").val("");
  $("#freqInput").val("");

}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

function calculateVariables() {
  var timeConvert = moment(firstTrain, "HH:mm").subtract(1, "years");
  var timeDiff = moment().diff(moment(timeConvert), "minutes");
  var remainder = timeDiff % frequency;
  minutesLeft = frequency - remainder;
  var nextTrain = moment().add(minutesLeft, "minutes");
  console.log(moment(nextTrain).format("X"));
  nextArrival = moment(nextTrain).format("HH:mm");

  console.log(moment(nextTrain).diff(moment(), "minutes"))
  minutesAway = moment(nextTrain).diff(moment(), "minutes")
  console.log(minutesAway);

};

