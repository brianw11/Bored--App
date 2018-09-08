//google maps api key AIzaSyDb2mZgiIgj3ns3iK4surGDeWRA-2W61gk
//meetup api key 477062e6c76427b59387c3568115f
var defaultMarker = {};
var locations = [];
var lat = 0;
var lng = 0;


//Meetup API Ajax
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

            console.log(title);
            console.log(link);
            console.log(lat);
            console.log(lng);

            meetDiv.append(title);
            meetDiv.append(desc);
            meetDiv.append(link)

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
            zoom: 8,
            center: defaultMarker
        });
    // The marker, positioned at each event
    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

    }
};