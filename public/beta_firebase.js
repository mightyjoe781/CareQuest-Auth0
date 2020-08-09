     /*Your web app's Firebase configuration*/
     var firebaseConfig = {
        apiKey: "AIzaSyChax-RIyl8an4nKJA0XLdIc8CyU3jeGgY",
        authDomain: "here-maps-bitsians.firebaseapp.com",
        databaseURL: "https://here-maps-bitsians.firebaseio.com",
        projectId: "here-maps-bitsians",
        storageBucket: "here-maps-bitsians.appspot.com",
        messagingSenderId: "517005193635",
        appId: "1:517005193635:web:846d53aebc789427b0ea16"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);


/*===========================adding locations to database - start==================================*/ 
function add_location(){
    function add_loc(h){
        firebase.database().ref('location/' + h.user_id).set(h);
    }
    
    var covidStatus = $('#covidstatus').val();

    var location = {
      user_id: firebase.auth().currentUser.uid,
      mob: firebase.auth().currentUser.phoneNumber,
      time: new Date().toLocaleString(),
      latitude: user_lat,
      longitude: user_lng,
      status: covidStatus
    };
    
    console.log(user_lat + " @ "+ user_lng);
    
    add_loc(location);
    }
/*===========================adding locations to database - end==================================*/ 

/*===========================fetching locations from database - start==================================*/
    

    var addonref = firebase.database().ref().child("location");

    addonref.on("value", function(snapshot) {

      var currentUserPhoneNumber = firebase.auth().currentUser.phoneNumber;
      
      map.removeObjects(map.getObjects());
      
      snapshot.forEach(function(childsnapshot){
        var item = childsnapshot.val();

        var userPosition = {lat: item.latitude , lng: item.longitude };
        console.log(userPosition);
        console.log(`status : ${item.status}`);

        //var checkUser = ((user_lat.toFixed(2)) == (item.latitude.toFixed(2)) && (user_lng.toFixed(2)) == (item.longitude.toFixed(2)));
        var checkUser = (currentUserPhoneNumber == item.mob);
        var checkRed = (item.status == "red");
        var checkYellow = (item.status == "yellow");
        var userIcon = (checkUser) ? (new H.map.Icon('./beta_icons/icons8-standing-man-48.png')) : ( (checkRed) ? (new H.map.Icon('./beta_icons/icons8-man-50.png')) : ( (checkYellow) ? (new H.map.Icon('./beta_icons/icons8-man-50 (2).png')) : (new H.map.Icon('./beta_icons/icons8-man-50 (1).png'))) );
        console.log(checkUser);

        let userMarker = new H.map.Marker(userPosition, {icon: userIcon});
        map.addObject(userMarker);
        

        
        //checking the coordinate range

        point = new H.geo.Point(item.latitude , item.longitude);
        var checkPosition = turf.booleanPointInPolygon(point.toGeoJSON(), circle.toGeoJSON());
        
        console.log("Is there someone ?")
        console.log(checkPosition);

       if(checkPosition){
          if(item.status == "red"){
            console.log("range mein aagaya red wala");
            console.log("changed to yellow");
          }
          else if(item.status == "yellow"){
            console.log("range mein aagaya yellow wala");
            console.log("changed to yellow");
          }
       }

       map.addObject(circle); // adding green circle around user

      userMarker.setData(firebase.auth().currentUser.phoneNumber);  
      
    });

  });

/*===========================fetching locations from database - end==================================*/
