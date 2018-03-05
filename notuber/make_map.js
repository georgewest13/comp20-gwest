var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 16, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var shortDist = 6378137 * 0.000621371; 

function init() {
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getMyLocation(); //find my location
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			addMe(); //render map
			getCarsLocations(); // find all drivers
			addMe(); // fix the shortest distance to a driver
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function addMe() {
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);
	
	// Create a marker
	var marker = new google.maps.Marker({
		position: me,
		title: "G1cLpMu7B2 is " + shortDist.toFixed(3) +
		  " miles to driver",
		icon: 'icon.jpg'
	});
	marker.setMap(map);
	
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}

function getCarsLocations() {
	// Step 1: Make a new XHR
	var request = new XMLHttpRequest();

	// Step 2: Open XHR
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", false);

    // Step 3: Set the request header to be returned
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Step 4: Obtain .json data and work with the data  
	request.onreadystatechange = function() {
  		if (request.readyState == 4 && request.status == 200) {
	        var result = request.responseText;
	     	data = JSON.parse(result);
	     	for (cnt = 0; cnt < data.vehicles.length; cnt++) {
	     		var lat = data.vehicles[cnt].lat;
	     		var lng = data.vehicles[cnt].lng
	     		var usrname = data.vehicles[cnt].username; 
	     		var car = new google.maps.LatLng(lat, lng);
	     		var dist = google.maps.geometry.spherical.computeDistanceBetween(me, car)
	     		           * 0.000621371;
	     		if (dist < shortDist)
	     			shortDist = dist;
	     		addToMap(usrname, dist, lat, lng); // add driver to the API
	     	}	
     	}
  	}
  	
  	// Step 5: Send my information to the server
  	request.send("username=G1cLpMu7B2&lat=" + myLat + "&lng=" + myLng);
}

function addToMap(name, dist, lat, lng) {
	car = new google.maps.LatLng(lat, lng);
	
	// Create a marker
	var marker = new google.maps.Marker({
		position: car,
		title: "" + name + " is " + dist.toFixed(3) +  " miles to passenger",
		icon: 'car.png'
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}



