
$(document).ready(function(){

    var trainData = new Firebase("https://train-scheduler-5fa63.firebaseio.com/")

	$("#addTrainBtn").on("click", function(){

		// Storing user input into vars
		var trainName = $("#trainNameInput").val().trim();
		var departure = $("#departureInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequencyInput").val().trim();

        // Object containing train data
		var newTrain = {
			name:  trainName,
			departure: departure,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		}

        // pushing trainInfo to Firebase if all fields are entered
        if (trainName !== "" && departure !== "" && destination !== "" && trainTimeInput !== "" && frequencyInput !== ""){
		trainData.push(newTrain);
        } else {
            alert("Please fill out all fields");
        }
		// clear text-boxes
		$("#trainNameInput").val("");
		$("#departureInput").val("");
        $("#destinationInput").val("");
        $("#trainTimeInput").val("");
        $("#frequencyInput").val("");

		// Prevents page from refreshing
		return false;
	});

	trainData.on("child_added", function(childSnapshot, prevChildKey){

        // assign firebase variables to snapshots.
		var firebaseName = childSnapshot.val().name;
		var firebaseLine = childSnapshot.val().departure;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;
		
		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
		


		// Append train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseLine + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
});