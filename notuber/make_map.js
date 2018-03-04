var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 13, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var drivers;

function init() {
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getMyLocation();
	getCarsLocations();
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);
	
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "G1cLpMu7B2 is " +  " miles to driver",
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
	var request;
	request = new XMLHttpRequest();

	request.open("GET", "https://jordan-marsh.herokuapp.com/rides", true);

	request.onreadystatechange = function() {
  		if (request.readyState == 4 && request.status == 200) {
	        var result = request.responseText;
	     	data = JSON.parse(result);
	     	for (cnt = 0; cnt < data.length; cnt++) {
	     		var lat = data.vehicles.lat;
	     		var lng = data.vehicles.lng
	     		drivers[cnt].username = data.vehicles[cnt].username; 
	     		var car = new google.maps.LatLng(lat, lng);
	     		var dist = google.maps.geometry.spherical.computeDistanceBetween(me, car);
	     		drivers[cnt].distance = dist;
	     		addToMap(drivers[cnt].username, drivers[cnt].distance, lat, lng);
	     	}	
     	}
  	}
  	//request.send();
}

function addToMap(name, dist, lat, lng) {
	car = new google.maps.LatLng(lat, lng);

	// Create a marker
	marker = new google.maps.Marker({
		position: car,
		title: name + " is " + dist * 0.000621371 +  " miles to passenger",
		icon: 'car.png'
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}



