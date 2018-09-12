var myIndex = 0;

carousel();

function carousel() {
    console.log("it works");
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

//google maps api key AIzaSyDb2mZgiIgj3ns3iK4surGDeWRA-2W61gk
//meetup api key 477062e6c76427b59387c3568115f
var defaultMarker = {};
var locations = [];
var lat = 0;
var lng = 0;
var zip = 80202;
var interest = "hiking"; //need to pull from firebase...

//find zipcode from user input to pull from meetup api
function zipcode() {
    var zipcode = 80303 //document.getElementById("location-input").value;
    geocoder.geocode({
        "location-input": zipcode
    }, function (results, status) {
        if (status == 'OK') {

            console.log("zipcode latlng", results);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


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
        console.log("Recommend Response", response.data);


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



//Meetup searched events
var meetupURL = "https://api.meetup.com/find/upcoming_events?";
$.ajax({
        url: meetupURL,
        method: "GET",
        dataType: 'jsonp',
        data: {
            key: "477062e6c76427b59387c3568115f",
            page: 10,
            text: interest,
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

            $("#meetup").append($meetDiv);

            defaultMarker.lat = parseFloat(response.data.events[i].group.lat);
            defaultMarker.lng = parseFloat(response.data.events[i].group.lon);

            locations.push({
                title,
                lat,
                lng
            });

        };
        //load meetup latlng into maps
        initMap();
    });
console.log("Locations Objects", locations);


//google maps section
var geocoder;

function initMap() {
    // The map, centered at zip from client input(latlng)
    //codeAddress();
    //geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng();
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 10,
            center: zip
        })

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

    // The marker, positioned at each event
    for (i = 0; i < locations.length; i++) {
        var marker = new google.maps.Marker({
            map: map,
            title: locations[i].title,
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng)
        })
    }
};