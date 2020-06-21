function route(){

  document.getElementById("status").innerHTML = "Routing Completed!";
  console.log(str);
  var alt = prompt("Enter number of routes to be displayed (Max : 4)");
   // Get an instance of the routing service version 8:
var router = platform.getRoutingService(null, 8);
// Create the parameters for the routing request:
var routingParameters = {
  transportMode:'car',
  routingMode: 'fast',
  mode:"balanced;car;traffic:enabled",
  origin: str,
  //via:'17,75!stopDuration=900',
  destination: end,
  return:'polyline,summary,actions,instructions', //summary + actions + instr included
  alternatives: alt, //alternative route option
  departureTime:'2020-05-13T09:00:00',  // arrival and departure
  spans:'speedLimit,duration,streetAttributes,names' //speed limit value
};
  
let startIcon = new H.map.Icon('start.png');

let endIcon = new H.map.Icon('end.png');

let viaIcon = new H.map.Icon('via.png');
// Define a callback function to process the routing response:
var onResult = function(result) {
  console.log(result);
  if (result.routes.length) {
    let routeNum = 0;

    result.routes.forEach(route =>{

      let totalLength = 0; 
      let totalDuration = 0;
	let cardNum = 0;
      let colors = ["#9400D3","#f461c3","#8B4513","black"]
      route.sections.forEach((section) => {
        // Create a linestring to use as a point source for the route line
       let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
        
       // Create a polyline to display the route:
       let routeLine = new H.map.Polyline(linestring, {
         style: { strokeColor: colors[result.routes.indexOf(route)], lineWidth: 5}
       });

       // Create a marker for the start point:
       
       let startMarker = new H.map.Marker(section.departure.place.location, {icon: startIcon});
      
       startMarker.setData("Routing Starts Here!"); 
       // Create a marker for the end point:
       let endMarker = new H.map.Marker(section.arrival.place.location, {icon: endIcon});
     
       endMarker.setData("Routing Ends Here!"); 
       totalLength += section.summary.length;
       totalDuration += section.summary.duration;
	      document.getElementById("cards-collector").innerHTML += '<div class="card"> <div class="content"><div class="header">Cute Dog</div><div class="description" id="route'+cardNum+'"></div> </div></div>'

       section.actions.forEach(action =>{
         document.getElementById("route"+cardNum+"").innerHTML += `<br>`+ action.instruction;

       });

       if(section.postActions){
        document.getElementById("panel").innerHTML += `<br>`+ section.postActions[0].action +' '+ section.postActions[0].duration + ' sec' ;
       }
 
       // Add the route polyline and the two markers to the map:
       map.addObjects([routeLine, startMarker, endMarker]);

       // Set the map's viewport to make the whole route visible:
       map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
	 cardNum++;
      });

      document.getElementById("panel").innerHTML += `<p><b>`+'Route '+(result.routes.indexOf(route)+1) +' | Distance : '+ totalLength/1000 +' Km'+' | Duration : '+ totalDuration.toMMSS() + `</b></p><hr>`;

      routeNum++;
    });
      
  }
};


var onError = function(error) {
  alert(error.message);
};

Number.prototype.toMMSS = function () {
  return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
}
  

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):


router.calculateRoute(routingParameters, onResult, onError);
}
