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

    function createInterestButton() {
        var dataKey = firebase.database().ref().push().key;
        var ref = firebase.database().ref("users/");
        ref.once("value").then(function(snapshot) {
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

});