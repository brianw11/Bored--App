//google maps api key AIzaSyDlbWxxrMf6_yGeGrcQdmO38iA_6Q-SLgw
//meetup api key 477062e6c76427b59387c3568115f

var queryURL = "https://api.meetup.com/find/groups?";


$.ajax({
        url: queryURL,
        method: "GET",
        dataType: 'jsonp',
        data: {
            key: "477062e6c76427b59387c3568115f",
            sign: true,
        
            
        }
    })
    .then(function (response) {
        
        console.log(response.data[0].name);
        var post = response.data[0].name;
        console.log(post);
        $("#meetup").append(post);
    });