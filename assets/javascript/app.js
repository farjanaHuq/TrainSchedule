$(document).ready(function () {

// firebase config
   
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAWq1SHzrr0kj86Pyn3wNS_tdSrI5SjBYk",
    authDomain: "train-time-schedule-11dfc.firebaseapp.com",
    databaseURL: "https://train-time-schedule-11dfc.firebaseio.com",
    projectId: "train-time-schedule-11dfc",
    storageBucket: "train-time-schedule-11dfc.appspot.com",
    messagingSenderId: "823723571722"
  };
    firebase.initializeApp(config);

    var database = firebase.database();
    var trainInfo = [];
    
    // Edit child from database
    // Remove child from database
    $(document).on('click', '.remove-btn', function(e){
        e.preventDefault();
        console.log('hello');

        database.ref().child($(this).attr('data-id')).remove();
        var i = trainInfo.findIndex(i => i.firebaseID === $(this).attr('data-id'))
        trainInfo.splice(i,1);
        console.log(trainInfo);
        $(`#row${($(this).attr('data-id'))}`).remove();
    });
    
     // Add train schedule to database
     database.ref().on('child_added', function (snap) {
        console.log(snap.val());
        console.log(snap);
        console.log(snap.ref_.key);

        //add train data to an array
        trainInfo.push({
            'firebaseID': snap.ref_.key,
            'trainName': snap.val().trainName,
            'destination': snap.val().destination,
            'firstTrainTime': snap.val().firstTrainTime,
            'frequency': snap.val().frequency,
        });
        var i = trainInfo.findIndex(i => i.firebaseID === snap.ref_.key);

        // append to table
        $('#train-table-body').append(`<tr id= "row${snap.ref_.key}">`);
        $(`#row${snap.ref_.key}`).append(`<td id= 'name${snap.ref_.key}' >${snap.val().trainName}</td>`);
        $(`#row${snap.ref_.key}`).append(`<td id= 'destination${snap.ref_.key}'>${snap.val().destination}</td>`);
        $(`#row${snap.ref_.key}`).append(`<td id= 'frequency${snap.ref_.key}'>${snap.val().frequency}</td>`);
        $(`#row${snap.ref_.key}`).append(`<td id= 'nextArrival${snap.ref_.key}'>
                 ${moment().add(calculateMinutesAway(i), 'm').format('LT')}</td>`);
        $(`#row${snap.ref_.key}`).append(`<td id= 'minutesAway${snap.ref_.key}'>${calculateMinutesAway(i)}</td>`);
          
        $(`#row${snap.ref_.key}`).append(`<td id= "remove${snap.ref_.key}">
              <button class="btn remove-btn" data-id="${snap.ref_.key}">Remove</button></td>`);
        $(`#row${snap.ref_.key}`).append(`<td id= "edit${snap.ref_.key}">
              <button class="btn edit-btn" data-id= "${snap.ref_.key}">Edit</button></td>`);

        calculateMinutesAway(i);
    });

    //call back function to calculate time to next train arrival and minutes away
    function calculateMinutesAway(i) {

        var firstTrainTimeConverted = Number(moment(trainInfo[i].firstTrainTime, 'LT'));
        var differenceInTime = Number(moment().diff(moment(firstTrainTimeConverted), "m"));
        var remainder = Number(differenceInTime % trainInfo[i].frequency);
        var minutesAway = Number(trainInfo[i].frequency - remainder);

        // console.log("Remainder" + remainder);
        // console.log(" Next train" + minutesAway );
        return minutesAway;
    }

    
    //Onclick for submit button
    $('#submit-train').on('click', function (e) {
        e.preventDefault();
         // send to database
         database.ref().push({
            trainName: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTrainTime: $("#first-train-time").val().trim(),
            frequency: $("#frequency").val().trim(),
        });
        //clear the form
        $("#train-name").val(" ");
        $("#destination").val(" ");
        $("#first-train-time").val(" ");
        $("#frequency").val(" ");
    });  
    
});



    






