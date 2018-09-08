$(document).ready(function () {

  var config = {
    apiKey: "AIzaSyBwd_OkkJXouIWKyJSE4dAY2v_4IHVvCVY",
    authDomain: "bored-app-7c3ca.firebaseapp.com",
    databaseURL: "https://bored-app-7c3ca.firebaseio.com",
    projectId: "bored-app-7c3ca",
    storageBucket: "bored-app-7c3ca.appspot.com",
    messagingSenderId: "728778720565"
  };
  firebase.initializeApp(config);

  //google maps api key AIzaSyDlbWxxrMf6_yGeGrcQdmO38iA_6Q-SLgw
  //meetup api key 477062e6c76427b59387c3568115f

  // Variables
  /*var queryURL = "https://api.meetup.com/find/groups?";
  
  //Ajax call for meetup
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
      })
      */
  //Firebase 
  var database = firebase.database();
  //var name = "";
  var interests = "";
  var location = "";
  //var date = "";

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
  
  database.ref().on("child_added", function(childSnapshot) {
      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val());
  }); 
  });
})
