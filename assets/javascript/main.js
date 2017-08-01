// innitizlize firebase

var config = {
    apiKey: "AIzaSyAils1jCtXuB7Nl_aSwOplDGqOdCW-1zZM",
    authDomain: "homework7-trainscedule.firebaseapp.com",
    databaseURL: "https://homework7-trainscedule.firebaseio.com",
    projectId: "homework7-trainscedule",
    storageBucket: "homework7-trainscedule.appspot.com",
    messagingSenderId: "926314013919"
};
firebase.initializeApp(config);
var database = firebase.database();

//create variable to hold value of form
var trainName, trainInformation = 0, destination, firstTrainTime, nextArrival, frequency;

//function to create trainInfo object
var TrainInfo = function(trainName, destination, firstTrainTime, frequency) {
    this.trainName = trainName;
    this.destination = destination;
    this.firstTrainTime =firstTrainTime;
    this.frequency = frequency;
}
// click submit button
$("#submit").on("click", function() {
    trainName = $("#trainName").val();
    destination = $("#destination").val();
    firstTrainTime = moment($("#firstTrainTime").val().trim(), "hh:mm").format("hh:mm");
    frequency = $("#frequency").val();    

    var trainInfo = new TrainInfo(trainName, destination, firstTrainTime, frequency);
        //save trainInfo object to firebase
    database.ref().push(trainInfo);

    console.log(trainInfo.trainName);
    console.log(trainInfo.destination);
    console.log(trainInfo.firstTrainTime);
    console.log(trainInfo.frequency);
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");
});

//process of firebase

database.ref().on("child_added", function(childSnapshot) {
      var trainName = childSnapshot.val().trainName;
	  var trainDestination = childSnapshot.val().destination;
	  var firstTrain = childSnapshot.val().first;
      var frequencyTrain = childSnapshot.val().frequency;

    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);


    // Time apart (remainder)
    var tRemainder = diffTime % frequencyTrain;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTilTrain = frequencyTrain - tRemainder;
    console.log("MINUTES TIL TRAIN: " + tMinutesTilTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTilTrain, "minutes").format("hh:mm");
    console.log(nextTrain);

    // add row to table
    $("#tableInfo").append("<tr class='bordered'><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
	  frequencyTrain + "</td><td>" + nextTrain + "</td><td>" + tMinutesTilTrain + "</td></tr>");
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

