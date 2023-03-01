
// Code for user entry for location using google places api
var locationInput = 'location_input';
//Checks user input and suggests locations
var autocomplete;
autocomplete = new google.maps.places.Autocomplete((document.getElementById(locationInput)), {
	types: ['geocode']
});
autocomplete.addListener("place_changed", fillInAddress);
// Function that returns the coordinates of the user entered location
function fillInAddress() {
	const place = autocomplete.getPlace();
	filledCoords = [place.geometry.location.lat(), place.geometry.location.lng()]
	return filledCoords
}
// End of get location code

// Code for get location button using geolocation api, once user clicks on the button and accepts location usage their coordinates are stored for later use and "Your Location" placed in location input box.
function getLocation(callback) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			var uCoords = [lat, long];
			$("#location_input").val("Your Location")
			callback(uCoords);
		});
	}
}

//Code to show more extra information about each match in the results table once clicked upon.
function matchInfo(element) {
	var matchID = element.id;
	//console.log(matchID);
	$('#' + matchID + ' p').show();


}

// Code to compare each matches location to the users inputted location and sorts the results from closest to furthest away from the users location.
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

//Code that checks the users entries into the form to see if the data is acceptable, if it is calls the doSearch method to produce result table results.
//Function to display box for search results
function search() {
	var maxDistance =parseFloat(document.getElementById('maxDistance').value)
	try {
		if(isNaN(maxDistance)){throw {name:'maxDistanceError'}} // Checks if the makes distance entered by the user is of an acceptable format to be used in the doSearch calls
		else{
			if (document.getElementById('location_input').value == "Your Location") { //Code that uses the users current coordinates in the doSearch call if they have specified that by using the get location button
				var userCoordinates = getLocation(function (position) {
					var uCoordinates = position;
					doSearch(uCoordinates,maxDistance);
				})
			}
			else if (typeof fillInAddress() !== "undefined") { // Code that checks users input is acceptable in relation to google places api (if the user has not chosen to use their location via the button)
				userCoordinates = fillInAddress();
				doSearch(userCoordinates,maxDistance); // If  acceptable calls doSearch function with coordinates from google places search
			}
		}
	} catch (e) {
		if(e.name == 'maxDistanceError'){ //Error catching for if the maxDistance field has not got an acceptable data entry
			$('#maxDistanceError').empty()
			$('#maxDistanceError').append("Not a number, please enter a integer")
		}
		else {
			$('#locationError').append("Location Not Found Try Again") //Error catching for if the enter your location field has not got an acceptable data entry
		}
	}
}

//Function to perform the actual searching of results for the results table
function doSearch(position,maxDistance) {
	//Initalises variable
	var searchResult = document.getElementById("searchResult");
	//Sets variables display to block, making it appear on the screen
	searchResult.style.display = "block"
	//Takes in user specified date
	var enteredDate = $("#enteredDate").val();
	//console.log(enteredDate);


	// Get data from SportsMonks
	$.getJSON('https://soccer.sportmonks.com/api/v2.0/fixtures/date/' + enteredDate + '?api_token=KJJq9ZnTPz3ddQ1nnivbXR2aWe0dAwfvkBcp1RB6xGvdOXGL27WauspXaGJb&include=localTeam,visitorTeam,venue,league', function (data) {
		//console.log(data)
		addResultTitles(position,maxDistance, data)//Calls the addResultTitles function
		$('.details').hide();//Hides extra match information when results are first loaded in

	}
	);
}


//Function used to calculate haversine distance between user entered location and each match location
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

// End of haversine distance calculation



//function to add the results list
function addResultTitles(position,maxDistance, data) {
	var userCoordinates = position;
	userLat = userCoordinates[0];
	userLong = userCoordinates[1];
	$('#results').empty();
	for (var i = 0; i < data.data.length; i++) { //Loops through for each match data recieved from sportsmonk api

		var venueCoords = data.data[i].venue.data.coordinates.split(",");
		var venueLat = venueCoords[0];
		var venueLong = venueCoords[1];
		var distanceToVenue = distanceCalculation(userLat, userLong, venueLat, venueLong) // Calls distanceCalculation function to find the haversine distance for each match
		if(maxDistance > distanceToVenue){//Error catching to make sure haversine distance is not 0 or less
			var title = data.data[i].localTeam.data.name + "  " + data.data[i].time.starting_at.time + "  " + data.data[i].visitorTeam.data.name;//Variable for creating fixture output for each match
			var leagueInfo = data.data[i].league.data.name; //Variable to find league details of match 
			try {// Error catching if the api does not hold stadium name information for the match
				var venueInfo = data.data[i].venue.data.name;
			} catch (error) {
				if (error) {
					venueInfo = "Stadium not found"
				}
			}
		


			//Jquery to add the match information to the results section for that match in the loop
			$('#results').append("<li id='match" + i + "' class='result' onclick='matchInfo(this)' >" + title + "<p class='details'>" + venueInfo + "</p>"
				+ "<p class='details'>" + leagueInfo + "</p>" + "<p class='details distance'>Directly " + distanceToVenue + " KM from you</p>" + "</li>");
		}
	}

}