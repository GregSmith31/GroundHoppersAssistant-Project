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
	console.log(data)
	addVenues(data)
}
);
$.getJSON('https://soccer.sportmonks.com/api/v2.0/countries/1161/teams?api_token=KJJq9ZnTPz3ddQ1nnivbXR2aWe0dAwfvkBcp1RB6xGvdOXGL27WauspXaGJb&include=league,venue&page=2', function (data) {
	console.log(data)
	addVenues(data)
}
);

const points = [];

function addVenues(data){
	var total = 0;
	for (var i = 0; i < data.data.length; i++) {
		if(data.data[i].league !== undefined && data.data[i].league.data.name !== "Scottish Cup" && data.data[i].league.data.name !== "Club Friendlies 1" && data.data[i].current_season_id !== 13138 ){
			try {
				var teamVenue = data.data[i].venue.data.name;
				marker = new L.marker(data.data[i].venue.data.coordinates.split(",")).bindPopup(data.data[i].venue.data.name +", " + data.data[i].name);
				var teamName = data.data[i].name;
				var leagueName = data.data[i].league.data.name;
				var temp = {"name":teamName, "marker":marker}
				points.push(temp);
				//console.log(data.data[i].venue.data.name)
				if(data.data[i].league.data.name === "Premiership"){
					$('#premiership').append('<label for="' + teamName +'">' + teamName + ':</label> <input type="checkbox" id="' + teamName +'" onclick="stadiumChecker(this)"><br>');
				}
				else if(data.data[i].league.data.name === "Championship"){
					$('#championship').append('<label for="' + teamName +'">' + teamName + ':</label> <input type="checkbox" id="' + teamName +'" onclick="stadiumChecker(this)"><br>');
				}
				else if(data.data[i].league.data.name === "League One"){
					$('#leagueOne').append('<label for="' + teamName +'">' + teamName + ':</label> <input type="checkbox" id="' + teamName +'" onclick="stadiumChecker(this)"><br>');
				}
				else if(data.data[i].league.data.name === "League Two"){
					$('#leagueTwo').append('<label for="' + teamName +'">' + teamName + ':</label> <input type="checkbox" id="' + teamName +'" onclick="stadiumChecker(this)"><br>');
				}
				else if(data.data[i].league.data.name === "Football League - Highland League"){
					$('#highlandLeague').append('<label for="' + teamName +'">' + teamName + ':</label> <input type="checkbox" id="' + teamName +'" onclick="stadiumChecker(this)"><br>');
				}
				else if(data.data[i].league.data.name === "Football League - Lowland League"){
					$('#lowlandLeague').append('<label for="' + teamName +'">' + teamName + ':</label> <input type="checkbox" id="' + teamName +'" onclick="stadiumChecker(this)"><br>');
				}

				total += 1;
				//console.log(total)
			} catch (error) {
				console.log(data.data[i].name)
				console.log(i)
			}
		}	
	}
	console.log(total)
}

//Function that adds a pin to the map if the checkbox is ticked & removes a pin if the box is unticked
function stadiumChecker(element) {
	var teamInfo = element.id;
	var team = teamInfo;
	var stadiumCoordsMarker;
	for (var j = 0; j < points.length; j++){
		if(points[j].name === team){
			stadiumCoordsMarker = points[j].marker;
			break;
		}
	}
		var checkBox = document.getElementById(teamInfo);
		if (checkBox.checked == true){
			mymap.addLayer(stadiumCoordsMarker);
		} else {
			mymap.removeLayer(stadiumCoordsMarker);
		}
	}
