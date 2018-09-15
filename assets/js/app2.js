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

    function createInterestButton() {
        var dataKey = firebase.database().ref().push().key;
        var ref = firebase.database().ref("users/");
        ref.once("value").then(function (snapshot) {
            var data = snapshot.val();
            console.log(snapshot.val());
            console.log(data.key.interest);
            //var interest = snapshot.child(dataKey)

        });
        //Dynamically create buttons 
        var x = $("<button>");
        x.addClass("new-interest");
        x.attr("data-key", dataKey);
        x.text(interest + "-" + zipcode);
        $("#interestButtons").append(x);
    }
    createInterestButton();


    $(".idea-button").on("click", function (event) {
        userInterest = $(this).text();
        console.log(userInterest);
        int = userInterest;
        locations = [];

        meetup();
    })
});




//google maps api key AIzaSyDb2mZgiIgj3ns3iK4surGDeWRA-2W61gk
//meetup api key 477062e6c76427b59387c3568115f
var defaultMarker = {};
locations = [];
var lat = 0;
var lng = 0;
var zip;
//int = userInterest; //need to pull from firebase...







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
            initMap();
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

function initMap() {

    // The map, centered at zip from client input(latlng)
    var bounds = new google.maps.LatLngBounds();
    var latlng = new google.maps.LatLng(39.750, -105.000);
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 9,
            center: latlng
        })



    // The marker, positioned at each event
    for (i = 0; i < locations.length; i++) {
        var marker = new google.maps.Marker({
            map: map,
            title: locations[i].title,
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng)
        })

    }

};