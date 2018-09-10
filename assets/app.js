$(document).ready(function () {
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

    //google maps api key AIzaSyDb2mZgiIgj3ns3iK4surGDeWRA-2W61gk
    //meetup api key 477062e6c76427b59387c3568115f
    var defaultMarker = {};
    var locations = [];
    var lat = 0;
    var lng = 0;



    //Meetup Reccommendations
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
            console.log("Recommend Response", response.data);


            for (var i = 0; i < response.data.length; i++) {
                var recommend = $("<div>").addClass("groups");
                var name = response.data[i].name
                var next = response.data[i].next_event.name
                var nextTime = response.data[i].next_event.time
                var link = response.data[i].link

                // console.log(name);
                //console.log(link);

                recommend.append("Group: " + name);
                recommend.append("Next Event: " + next);
                recommend.append("Time: " + nextTime);
                recommend.append(link)

                $("#recommendations-field").append(recommend);
            }
        });





    //Meetup searched events
    var meetupURL = "https://api.meetup.com/find/upcoming_events?";
    $.ajax({
        url: meetupURL,
        method: "GET",
        dataType: 'jsonp',
        data: {
            key: "477062e6c76427b59387c3568115f",
            // sign: true,
            page: 10,
        }
    })
        .then(function (response) {
            console.log("Ajax Response", response.data.events);


            for (var i = 0; i < response.data.events.length; i++) {
                var meetDiv = $("<div>").addClass("groups");
                var title = response.data.events[i].group.name
                var desc = response.data.events[i].description
                var link = response.data.events[i].link
                lat = parseFloat(response.data.events[i].group.lat);
                lng = parseFloat(response.data.events[i].group.lon);

                //console.log(title);
                // console.log(link);
                // console.log(lat);
                // console.log(lng);

                meetDiv.append("Group: " + title);
                meetDiv.append("Description: " + desc);
                meetDiv.append("Check it out: " + link)

                $("#meetup").append(meetDiv);

                defaultMarker.lat = parseFloat(response.data.events[i].group.lat);
                defaultMarker.lng = parseFloat(response.data.events[i].group.lon);

                locations.push({
                    title,
                    lat,
                    lng
                });

            };
            initMap();
        });
    console.log("Locations Objects", locations);




    //google maps section
    function initMap() {
        // The map, centered at event
        var map = new google.maps.Map(
            document.getElementById('map'), {
                zoom: 10,
                center: defaultMarker
            });

        // The marker, positioned at each event


        for (i = 0; i < locations.length; i++) {

            var marker = new google.maps.Marker({
                map: map,
                title: locations[i].title,
                position: new google.maps.LatLng(locations[i].lat, locations[i].lng)
            })

        }
    };

    //Firebase Section ---
    //Firebase variables
    var database = firebase.database();
    var username = $("#username-input");
    var interest = $("#interest-input");
    var location = $("#location-input");
    var password = $("#password-input");
    var email = $("#email-input");

    $("#createaccount").on("click", function () {
        firebase.auth().createUserWithEmailAndPassword(email, password)

            .catch(function (err) {
                // Handle errors
            })
        console.log(password, email, username);
    })


    // Register a new user
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (err) {
            // Handle errors
        });

    // Sign in existing user
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (err) {
            // Handle errors
        });

    // Sign out user
    firebase.auth().signOut()
        .catch(function (err) {
            // Handle errors
        });

    $("#submit").on("click", function (event) {
        event.preventDefault();
        console.log("ItWorked");

        //Get Inputs
        // name = $("#nameInput").val().trim();
        interests = $("#interests-input").val().trim();
        // date = $("#date-input").val().trim();
        location = $("#location-input").val().trim();

        //Change what is saved in firebase
        database.ref().push({
            //name: name,
            //date: date,
            location: location,
            interests: interests,
            //dateAdded: firebase.database.Servervalue.TIMESTAMP

        });

        database.ref().on("child_added", function (childSnapshot) {
            // Log everything that's coming out of snapshot
            console.log(childSnapshot.val());
        });
    });

//-----
    firebase.auth().onAuthStateChanged(function (user) {
        window.user = user; // user is undefined if no user signed in
    });



/* Additional Firebase Pseudo Code .....
Firebase - email sign in.   

On submit button - take the information in the form and submit it to firebase
*/
})
