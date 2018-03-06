// creates a google API and mimics uber front end functionality

var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var setLoc = {
	zoom: 16, 
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var shortDist = 6378137 * 0.000621371; 
var data = 0;

function init() {
	map = new google.maps.Map(document.getElementById("map"), setLoc);
	getMyLocation(); // find my location
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			addMe(); //render map
			getCarsLocations(); // find all drivers
		}, function() {
			alert("Couldn't find your location. Geolocation may be blocked" +
					" due to insecure connection.");
		});
	}
	else {
		alert("Your web browser doesn't support Geolocation.");
	}
}

function addMe() {
	me = new google.maps.LatLng(myLat, myLng);

	// add me to map and go to me's location
    map.panTo(me);

	if (data != 0) {
		if (Object.keys(data)[0] == "vehicles") {
			var marker = new google.maps.Marker({
				position: me,
				title: "G1cLpMu7B2 is " + shortDist.toFixed(3) +
				  " miles to closest driver",
				icon: 'icon.jpg'
			});
		} else {
			var marker = new google.maps.Marker({
				position: me,
				title: "G1cLpMu7B2 is " + shortDist.toFixed(3) +
				  " miles from closest passenger",
				icon: 'car.png'
			});
		}
		marker.setMap(map);
	
		// create info window that displays on click
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});
	}
}

function getCarsLocations() {
	// Step 1: Make a new XHR
	var request = new XMLHttpRequest();

	// Step 2: Open XHR
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);

    // Step 3: Set the request header to be returned
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Step 4: Obtain .json data and work with the data  
	request.onreadystatechange = function() {
  		if (request.readyState == 4 && request.status == 200) {
	        var result = request.responseText;
	     	data = JSON.parse(result);
	     	values = Object.values(data);
	     	lookFor = values[0] 
	     	for (cnt = 0; cnt < lookFor.length; cnt++) {
	     		var lat = lookFor[cnt].lat;
	     		var lng = lookFor[cnt].lng
	     		var usrname = lookFor[cnt].username; 
	     		var car = new google.maps.LatLng(lat, lng);
	     		var dist = google.maps.geometry.spherical.computeDistanceBetween(me, car)
	     		           * 0.000621371;
	     		if (dist < shortDist)
	     			shortDist = dist;
	     		addToMap(usrname, dist, lat, lng); // add driver to the API
	     	}	
	     	addMe(); //fix the shortest distance to a driver
     	}
  	}
  	
  	// Step 5: Send my information to the server
  	request.send("username=G1cLpMu7B2&lat=" + myLat + "&lng=" + myLng);

}

function addToMap(name, dist, lat, lng) {
	car = new google.maps.LatLng(lat, lng);
	
	// create a marker
	if (data != 0) {
		if (Object.keys(data)[0] == "vehicles") {
			var marker = new google.maps.Marker({
				position: car,
				title: "" + name + " is " + shortDist.toFixed(3) +
				  " miles from passenger",
				icon: 'car.png'
			});
		} else {
			var marker = new google.maps.Marker({
				position: car,
				title: "" + name + " is " + shortDist.toFixed(3) +
				  " miles to driver",
				icon: 'icon.jpg'
			});
		}
		marker.setMap(map);
	
		// create info window that displays on click
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});
	}

}

