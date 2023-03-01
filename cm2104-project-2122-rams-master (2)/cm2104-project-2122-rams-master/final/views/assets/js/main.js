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
//Function to display guidance to the user if they are on the map page and not logged in
function loginPrompt(){
	alert("Please login in via the account page to save your selections")
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
//Animated pie chart code for pie chart in accounts page
// Create a function for setting a variable value
$(document).ready(function pieChartSystem() {
	var teams = $("#userTeamsHidden").text();//Takes in the data about which teams the user has stored in the map page from the database via a hidden element
	var teamsList = (teams.split(","));//Culminates the string into an error with each team selected by the user being a element in the array
	var teamsCount = teamsList.length;//Finds how many teams are in the array
	if(teamsCount== 1){//Error catching if user has no teams associated with their account 
		if(teamsList[0] === ""){
			teamsCount = 0;
		}
	}
	var teamsPercent = (parseFloat((teamsCount/76)*100));
	var teamsCirclePercent = Math.round(parseFloat((teamsCount/76)*360));//Calculates how far round the resultant circle should go
	if(teamsCount > 0){//Only performs code required for the animation if user has teams associated with their account
		var outputPercent = 1;//Initializes variable
		var r = document.querySelector(':root');//Gets the starting information from the root css of the account page
		var userPercent = teamsCirclePercent;
		var rs = 0;//Initializes incrementer so circle begins at zero when first loaded
		const myInterval = setInterval(pieChartMechanics, 20)//Adds a delay to end of each incrementation of the circle so piechart is animated and not instantaneously loaded fully
		function pieChartMechanics() {
			$('#userPerctile').html(parseInt(outputPercent) + "%");//Used to display a percentage out of a hundred to user, once the animation ends it will be at the percentatge of the teams associated with the user out of the total teams (76)
			rs = (parseInt(getComputedStyle(r).getPropertyValue('--degree')) + 1);// Used to animate the circle increasing the degrees of the piechart until function call loop ends
			outputPercent+=((1/360)*100);//Increments the percentage displayed to the user until the function call loop ends
			if (rs == userPercent) {//Ends function call loop once the pie chart has reached the same value out of 360 that has been speciefied for that user, ending the animation
				clearInterval(myInterval)
			}
			rsOutput = rs + "deg";//puts rs variable into acceptable form for the css custom variable
			r.style.setProperty('--degree', rsOutput);//Used to update the css value of the custom css variable --degree used for the pie chart

		}
	}
	else{//Displays 0% if the user has no teams associated with their account
		$('#userPerctile').html("0%");
	}
});



//}your functions are a bit of a  mess. Try to keep functions at the root level, not nested inside other functions.




