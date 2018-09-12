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
    var interest= $("#interest-input");
    var zipcode = $("#zipcodeMain-input");
    var email = $("#email-input");
    var password = $("#password-input")


    $("#signin").on("click", function () {
        writeUserData();  
        console.log("Yay");
    })
    
    //Firebase functions
    function writeUserData() {
        database.ref()('users/' + username).set({
            email: email,
            password: password,
            zipcode: zipcode
        })
    }
    

    function saveInterest() {
        database.ref()('users/' + username + "/zipcode").set({
            zipcode: zipcode,
            interest: interest
        })    
    }

    database.ref().on("value", function(snapshot){
        console.log(snapshot.val());
    })

    $("#submit").on("click", function() {
        saveInterest();
        createInterestBtn();
    })

    
})
