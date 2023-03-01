//Intialising map
var mymap = L.map('mapid').setView([56.4907, -3.9169042829915286], 6);

//Initalising leaflet canvas for map
var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(mymap);

// Get data from SportsMonks
$.getJSON('https://soccer.sportmonks.com/api/v2.0/countries/1161/teams?api_token=KJJq9ZnTPz3ddQ1nnivbXR2aWe0dAwfvkBcp1RB6xGvdOXGL27WauspXaGJb&include=league,venue&page=1', function (data) {	
	addVenues(data)
}
);
$.getJSON('https://soccer.sportmonks.com/api/v2.0/countries/1161/teams?api_token=KJJq9ZnTPz3ddQ1nnivbXR2aWe0dAwfvkBcp1RB6xGvdOXGL27WauspXaGJb&include=league,venue&page=2', function (data) {
	addVenues(data)
}
);
//Initializes points array to be used later
const points = [];
//Function that takes in data taken from sportsmonks api and uses it to populate the lists of teams and their location information on the map
function addVenues(data) {
	var total = 0;
	for (var i = 0; i < data.data.length; i++) {//Loops through every team in data that was provided by sportsmonk api
		//Error catching to make sure its only the teams currently in the specified leagues
		if (data.data[i].league !== undefined && data.data[i].league.data.name !== "Scottish Cup" && data.data[i].league.data.name !== "Club Friendlies 1" && data.data[i].current_season_id !== 13138) {
			try {
				var teamVenue = data.data[i].venue.data.name;
				marker = new L.marker(data.data[i].venue.data.coordinates.split(",")).bindPopup(data.data[i].venue.data.name + ", " + data.data[i].name);//Initializes map location for team
				var teamName = data.data[i].name;//Sets the display name for that team to their name
				var leagueName = data.data[i].league.data.name;
				var temp = { "name": teamName, "marker": marker }//Temporary json variable used to store the teams map data and their name together
				points.push(temp); // Adds the data from the temporary variable to the points array so can be used later
				//console.log(data.data[i].venue.data.name)
				//Checks what league a team is in and adds them to that leagues section on the frontend, If a teams checkbox is clicked on the frontend the stadiumChecker function is called.
				if (data.data[i].league.data.name === "Premiership") {
					$('#premiership').append('<label for="' + teamName + '">' + teamName + ':</label> <input type="checkbox" id="' + teamName + '" name="teams[]" onclick="stadiumChecker(this)"><br>');
				}
				else if (data.data[i].league.data.name === "Championship") {
					$('#championship').append('<label for="' + teamName + '">' + teamName + ':</label> <input type="checkbox" id="' + teamName + '" name="teams[]" onclick="stadiumChecker(this)"><br>');
				}
				else if (data.data[i].league.data.name === "League One") {
					$('#leagueOne').append('<label for="' + teamName + '">' + teamName + ':</label> <input type="checkbox" id="' + teamName + '" name="teams[]" onclick="stadiumChecker(this)"><br>');
				}
				else if (data.data[i].league.data.name === "League Two") {
					$('#leagueTwo').append('<label for="' + teamName + '">' + teamName + ':</label> <input type="checkbox" id="' + teamName + '" name="teams[]" onclick="stadiumChecker(this)"><br>');
				}
				else if (data.data[i].league.data.name === "Football League - Highland League") {
					$('#highlandLeague').append('<label for="' + teamName + '">' + teamName + ':</label> <input type="checkbox" id="' + teamName + '" name="teams[]" onclick="stadiumChecker(this)"><br>');
				}
				else if (data.data[i].league.data.name === "Football League - Lowland League") {
					$('#lowlandLeague').append('<label for="' + teamName + '">' + teamName + ':</label> <input type="checkbox" id="' + teamName + '" name="teams[]" onclick="stadiumChecker(this)"><br>');
				}

				total += 1;
				//console.log(total)
			} catch (error) {
			}
		}
	}
	//Code used to check the checkboxes of the teams associated with the user once the page is loaded, if a user is logged into the site, also calls the stadiumChecker function for each of these associated teams.
	var teams = $("#userTeams").text();
	var teamsList = (teams.split(","))
	for (let index = 0; index < teamsList.length; index++) {
		var teamElement = document.getElementById(teamsList[index]);
		teamElement.checked = true;
		stadiumChecker(teamElement)
	}

}

//Function that adds a pin to the map if the checkbox is ticked & removes a pin if the box is unticked and adds pin to map if team is associated to user when page is loaded (if user logged in)
function stadiumChecker(element) {
	var teamInfo = element.id;
	var team = teamInfo;
	var stadiumCoordsMarker;
	for (var j = 0; j < points.length; j++) {
		if (points[j].name === team) {
			stadiumCoordsMarker = points[j].marker;
			break;
		}
	}
	var checkBox = document.getElementById(teamInfo);
	if (checkBox.checked == true) {
		mymap.addLayer(stadiumCoordsMarker);
	} else {
		mymap.removeLayer(stadiumCoordsMarker);
	}
}



//Code for save button, once clicked sends a post request to the server to save the teams the user has checkboxes checked for to their account.
$("#createSS").click(function (event) {
	event.preventDefault();
	var checkBoxStatus = $(".teamLists input:checkbox:checked").map(function () {
		return $(this).attr('id');
	}).get();
	
	$.ajax({
		url: '/teamCheckBoxes', type: 'post',
		data: { checkboxstatus: checkBoxStatus },
		success: function (response) {
		}
	});
});
