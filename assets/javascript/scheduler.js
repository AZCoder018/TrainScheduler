
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDFekfp0YxDY66st4GEYspWl3C78-jOKsA",
  authDomain: "trainscheduler-86d61.firebaseapp.com",
  databaseURL: "https://trainscheduler-86d61.firebaseio.com",
  projectId: "trainscheduler-86d61",
  storageBucket: "trainscheduler-86d61.appspot.com",
  messagingSenderId: "478183497960"
};
firebase.initializeApp(config);

var database = firebase.database();
$('#addTrainBtn').on("click", function () {
  
  var trainName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var firstTrain = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $("#frequencyInput").val().trim();

  //Create local temporary object to hold train data
  var newTrain = {
    name: trainName,
    place: destination,
    ftrain: firstTrain,
    freq: frequency
  }

  //Upload to Firebase
  database.ref().push(newTrain);
  
  // Clear text-boxes
  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#timeInput").val("");
  $("#frequencyInput").val("");

  // Prevents moving to new page
  return false;
});

//  Create event listener for adding trains to Firebase; add row in the html when the user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  
  // Store the childSnapshot values into variables

  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().place;
  var firstTrain = childSnapshot.val().ftrain;
  var frequency = childSnapshot.val().freq;

  // First Train pushed back to make sure it comes before current time
  var firstTimeConverted = moment(firstTrain, "HH:mm");
  var currentTime = moment().format("HH:mm");

  // Variable for difference between currentTime and fisrt train 
  var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");

  // Remainder of the time left and store in a variable
  var timeRemainder = timeDiff % frequency;
 
  // Variable for minutes until train 
  var minToTrain = frequency - timeRemainder;

  var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
  $("#trainTable>tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + nxTrain + "</td><td>" + frequency + "</td><td>" + minToTrain + "</td></tr>");
});