//Function to set class of navbar to 'responsive'
function responsiveNav() {
	//Initialises variable
	var responsive = document.getElementById("myNavbar");
	//Checks if the class name is navbar
	if (responsive.className === "navbar") {
		//Assign the class responsive to the navbar
		responsive.className += " responsive";

	} else {

		responsive.className = "navbar";

	}
}

//Function to make registration section appear and register prompt button disappear
function toggleRegister() {
	//Initialises variables
	var popup = document.getElementById("register")
	var button = document.getElementById("registerPrompt")
	//Sets variables display to block, making it appear on the screen
	popup.style.display = "block";
	//Sets variables display to none, making it disappear from the screen
	button.style.display = "none"

}

var locationInput = 'location_input';

var autocomplete;
autocomplete = new google.maps.places.Autocomplete((document.getElementById(locationInput)), {
	types: ['geocode']
});
autocomplete.addListener("place_changed", fillInAddress);

function fillInAddress() {
	const place = autocomplete.getPlace();
	filledCoords = [place.geometry.location.lat(), place.geometry.location.lng()]
	return filledCoords
}

function getLocation(callback) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			var uCoords = [lat, long];
			$("#location_input").val("Your Location")
			//return callback(uCoords) //you dont return the callback function you simply call the callback. Remember in javascript functions can be passed around like anything else. If you return the function you are returning the WHOLE function object. What you want to do is run your call back function passing it the data you need
			callback(uCoords);
		});
	}
}

function matchInfo(element) {
	var matchID = element.id;
	//console.log(matchID);
	$('#' + matchID + ' p').show();


}

//Function below inspired by https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_list
function sortByDistance() {
	var list, i, switching, b, shouldSwitch;
	list = document.getElementById("results");
	switching = true;
	/* Make a loop that will continue until
	no switching has been done: */
	while (switching) {
		// start by saying: no switching is done:
		switching = false;
		b = list.getElementsByClassName("distance");
		// Loop through all list-items:
		for (i = 0; i < (b.length - 1); i++) {
			var stringText1 = (b[i].innerText)
			var firstSpace1 = (stringText1.indexOf(" "))+1
			var secondSpace1 = (stringText1.indexOf(" ", firstSpace1))
			var distance1 = parseFloat(stringText1.substring(firstSpace1,secondSpace1))
		
			var stringText2 = (b[i+1].innerText)
			var firstSpace2 = (stringText2.indexOf(" "))+1
			var secondSpace2 = (stringText2.indexOf(" ", firstSpace2))
			var distance2 = parseFloat(stringText2.substring(firstSpace2,secondSpace2))
			
			// start by saying there should be no switching:			
			shouldSwitch = false;
			/* check if the next item should
			switch place with the current item: */
			if (distance1> distance2) {
				shouldSwitch = true;
				//console.log(b[i].parentNode.parentNode)
				break;
			}
		}
		if (shouldSwitch) {
			list.insertBefore(b[i + 1].parentNode, b[i].parentNode)
			switching = true;
		}
	}
}


//Function to display box for search results
function search() {
	var maxDistance =(document.getElementById('maxDistance').value)
	try {
		if(isNaN(maxDistance)){throw {name:'maxDistanceError'}}
		else{
			if (document.getElementById('location_input').value == "Your Location") {
				var userCoordinates = getLocation(function (position) {
					var uCoordinates = position;
					//return uCoordinates; //you dont need to return anything. You can just cal the methods you need here. 
					doSearch(uCoordinates,maxDistance);
				})
			}
			else if (typeof fillInAddress() !== "undefined") {
				userCoordinates = fillInAddress();
				doSearch(userCoordinates,maxDistance);
			}
		}
	} catch (e) {
		if(e.name == 'maxDistanceError'){
			$('#maxDistanceError').empty()
			$('#maxDistanceError').append("Not a number, please enter a integer")
		}
		else {
			$('#locationError').append("Location Not Found Try Again")
			//if you can;t get coordinates, you can't search...so don't
		}
	}
}

//just cal this function when you need to do an actual search and pass it the position
function doSearch(position,maxDistance) {
	//Initalises variable
	var searchResult = document.getElementById("searchResult");
	//Sets variables display to block, making it appear on the screen
	searchResult.style.display = "block"

	var enteredDate = $("#enteredDate").val();
	//console.log(enteredDate);


	// Get data from SportsMonks
	$.getJSON('https://soccer.sportmonks.com/api/v2.0/fixtures/date/' + enteredDate + '?api_token=KJJq9ZnTPz3ddQ1nnivbXR2aWe0dAwfvkBcp1RB6xGvdOXGL27WauspXaGJb&include=localTeam,visitorTeam,venue,league', function (data) {
		//console.log(data)
		addResultTitles(position,maxDistance, data)
		$('.details').hide();

	}
	);
}

//Two functions below inspired by:
//https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function distanceCalculation(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = (R * c).toFixed(2); // Distance in km
	return d;
}



function deg2rad(deg) {
	return deg * (Math.PI / 180)
}





//function to add the results list
function addResultTitles(position,maxDistance, data) {
	var userCoordinates = position;
	userLat = userCoordinates[0];
	userLong = userCoordinates[1];
	$('#results').empty();
	console.log(data);
	for (var i = 0; i < data.data.length; i++) {

		var venueCoords = data.data[i].venue.data.coordinates.split(",");
		var venueLat = venueCoords[0];
		var venueLong = venueCoords[1];
		var distanceToVenue = distanceCalculation(userLat, userLong, venueLat, venueLong)
		console.log(data.data[i].venue.data.name)
		console.log(distanceToVenue)
		console.log(maxDistance)
		if(maxDistance > distanceToVenue){
			var title = data.data[i].localTeam.data.name + "  " + data.data[i].time.starting_at.time + "  " + data.data[i].visitorTeam.data.name;
			var leagueInfo = data.data[i].league.data.name;
			try {
				var venueInfo = data.data[i].venue.data.name;
			} catch (error) {
				if (error) {
					venueInfo = "Stadium not found"
				}
			}
		



			$('#results').append("<li id='match" + i + "' onclick='matchInfo(this)' >" + title + "<p class='details'>" + venueInfo + "</p>"
				+ "<p class='details'>" + leagueInfo + "</p>" + "<p class='details distance'>Directly " + distanceToVenue + " KM from you</p>" + "</li>");
		}
	}

}






//}your functions are a bit of a  mess. Try to keep functions at the root level, not nested inside other functions.




