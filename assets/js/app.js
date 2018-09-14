var myIndex = 0;

carousel();

function carousel() {

    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {
        myIndex = 1
    }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 6000);
}

var interest;
var zipcode;
var userInterest;
var int;
$(document).ready(function () {
    //start maps functions
    //codeAddress();
    meetup();



    // Firebase config
    var config = {
        apiKey: "AIzaSyBwd_OkkJXouIWKyJSE4dAY2v_4IHVvCVY",
        authDomain: "bored-app-7c3ca.firebaseapp.com",
        databaseURL: "https://bored-app-7c3ca.firebaseio.com",
        projectId: "bored-app-7c3ca",
        storageBucket: "bored-app-7c3ca.appspot.com",
        messagingSenderId: "728778720565"
    };
    //Firebase Initialized...
    firebase.initializeApp(config);

    //Firebase Section ---

    var database = firebase.database();
    //Firebase variables
    var username = $("#username-input");
    var zipcode = $("#zipcodeMain-input");
    var interest = $("#interest-input");
    var email = $("#email-input");
    var password = $("#password-input")

    function writeUserData(username, email, password, zipcode) {
        //Firebase functions
        firebase.database().ref('users/' + username).set({
            email: email,
            password: password,
            zipcode: zipcode
        })

    }

    function saveInterest(username, zipcode, interest) {
        firebase.database().ref('users/' + username + "/zipcode").set({
            zipcode: zipcode,
            interest: interest
        })
    }

    database.ref().on("value", function (snapshot) {
        console.log("database", snapshot.val());

    })

    $("#submit").on("click", function (event) {
        event.preventDefault();
        saveInterest();
        createInterestBtn();

    })

    $("#signin").on("click", function (event) {
        event.preventDefault();
        console.log("Yay");
        writeUserData();

    })

    $(".idea-button").on("click", function (event) {
        userInterest = $(this).text();
        console.log(userInterest);
        int = userInterest;
        locations = [];

        meetup();
    })
})




//google maps api key AIzaSyDb2mZgiIgj3ns3iK4surGDeWRA-2W61gk
//meetup api key 477062e6c76427b59387c3568115f
var defaultMarker = {};
locations = [];
var lat = 0;
var lng = 0;
var zip;
//int = userInterest; //need to pull from firebase...




//Meetup Local Area Reccommendations
var recommendURL = "https://api.meetup.com/recommended/groups?";
$.ajax({
        url: recommendURL,
        method: "GET",
        dataType: 'jsonp',
        data: {
            key: "477062e6c76427b59387c3568115f",
            page: 5,
        }
    })
    .then(function (response) {
        // console.log("Recommend Response", response.data);


        for (var i = 0; i < response.data.length; i++) {
            var $recommend = $("<div>").addClass("groups");
            var name = response.data[i].name
            var next = response.data[i].next_event.name
            var nextTime = response.data[i].next_event.time
            var link = response.data[i].link
            var timeFormat = moment(nextTime).format("ddd MMM Do h:mm a");
            var bold = 'bold';

            //push group to div
            $recommend.append("**********************************************************************************");
            $recommend.append(`<p class=${bold}>Group:</p> ${name}`);
            $recommend.append(`<p class=${bold}>Next Event:</p> ${next}`);
            $recommend.append(`<p class=${bold}>Time:</p> ${timeFormat}`);
            $recommend.append(`<p class=${bold}>Check it out:</p><a href='${link}' target='_blank'>${link}</a>`);


            $("#recommendations-field").append($recommend);
        }
    });


function meetup() {
    console.log("int", int);
    //Meetup searched events
    var meetupURL = "https://api.meetup.com/find/upcoming_events?";
    $.ajax({
            url: meetupURL,
            method: "GET",
            dataType: 'jsonp',
            data: {
                key: "477062e6c76427b59387c3568115f",
                page: 10,
                text: int,
            }
        })
        .then(function (response) {
            console.log("Ajax Response", response.data.events);

            for (var i = 0; i < response.data.events.length; i++) {
                var $meetDiv = $("<div>").addClass("groups");
                var title = response.data.events[i].group.name
                var desc = response.data.events[i].description
                var eventLink = response.data.events[i].link
                var bold = 'bold';
                lat = parseFloat(response.data.events[i].group.lat);
                lng = parseFloat(response.data.events[i].group.lon);

                //append event info to DOM
                $meetDiv.append("**********************************************************************************");
                $meetDiv.append(`<p class=${bold}>Group:</p> ${title}`);
                $meetDiv.append(`<p class=${bold}>Description:</p> ${desc}`);
                $meetDiv.append(`<p class=${bold}>Check it out:</p><a href='${eventLink}' target='_blank'>${eventLink}</a>`)

                $("#meetup").prepend($meetDiv);

                defaultMarker.lat = parseFloat(response.data.events[i].group.lat);
                defaultMarker.lng = parseFloat(response.data.events[i].group.lon);

                locations.push({
                    title,
                    lat,
                    lng
                });

            };
            
        });
    console.log("Locations Objects", locations);
    
}

//google maps section
// var geocoder;

// function codeAddress() {
//     var address = document.getElementById("location-input").value; //need to find id for zipcode from firebase...
//     geocoder.geocode({"location-input": address}, function (results, status) {
//         if (status == 'OK') {
//             map.setCenter(results[0].geometry.location);
//             console.log("latlng", results);
//         } else {
//             alert('Geocode was not successful for the following reason: ' + status);
//         }
//     });
// }

