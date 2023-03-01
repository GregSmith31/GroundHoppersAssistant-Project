var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/users"
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.use(session({ secret: 'example' }));
app.use(express.static("views"))
app.use(bodyParser.urlencoded({
    extended: true
}))

//Sets view engine to ejs
app.set('view engine', 'ejs');

//Variable to represent the database
var db;

//Connection to mongodb
MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
  });

//Creates the route to the index page
app.get('/', function(req, res){

    res.render('pages/index');

});

//Creates the route to the map page
app.get('/map', function(req, res){

    //Checks the seesion to see if user is logged in
    if(!req.session.loggedin){

        //If the user is not logged in the map page is loaded
        res.render('pages/map');

    }else{
    
        //If the user is logged in they are redirected to the logged in version of the map page
        res.redirect('/mapLoggedIn');

    }

});

//Creates the route for the loggind in version of the map page
app.get('/mapLoggedIn', function(req, res){

    //Checks the seesion to see if user is logged in so the user cant access the page before they are logged in
    if(!req.session.loggedin){

        //If the user is not logged in the map page is loaded
        res.redirect('/map');return;

    }

    //Sets the variabel email to the session variable useremail
    var email = req.session.useremail;    
    
    //Searches the database for the users email
    db.collection('users').findOne({'email': email}, function(err, result){
        if(err) throw err;
        //The query result is sent to the logged in map page as 'users'
        res.render('pages/mapLoggedIn', {
            users:result
        })

    });

})

//Creates the route for the login page
app.get('/login', function(req, res){

    //Checks if the user is logged in and if so redirects them to the account page
    if(req.session.loggedin){
        
        res.redirect('/account');

    }else{
    //Renders the login page
    res.render('pages/login');

    }
});

//Creates the route for the account page
app.get('/account', function(req, res){
    
    //Checks if the user is logged in to prevent the accessing the page before they are
    if(!req.session.loggedin){

        //Redirects the user to the login page
        res.redirect('/login');return;

    }

    //Sets the variable email to the session variable useremail
    var email = req.session.useremail;    
    
    //Searches the database for the users email
    db.collection('users').findOne({'email': email}, function(err, result){
        if(err) throw err;

        //The query result is sent to the logged in map page as 'users'
        res.render('pages/account', {
            users:result
        })

    });
    
});

//Creates the post route to take the details from the log in form
app.post('/loginform', function(req, res){

    //Takes the email and password variables from the form and sets the email to lowercase
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    
    //Searches the database for the users email
    db.collection('users').findOne({"email":email}, function(err, result){

        if(err) throw err;
        
        //If no user is found with a matching email the user is redirected back to the login page
        if(!result){res.redirect('/login');return;}
        
        //Checks if the entered password matches the result found in the database
        if(result.password == password){
            
            //Sets the session variables loggedin to true and useremail to the lowercase email
            req.session.loggedin = true; 
            req.session.useremail = email;
            //Redirects the user to the account page to show theve been logged in
            res.redirect('/account')
        
        }

        //If the users password is not correct they are redirected back to the login page
        else{res.redirect('/login')}
    });
    
});

//Creates the post route to take the details from the register form
app.post('/registerform', function(req, res){

    //Takes the email, password and verifypassword variables from the form and sets the email to lowercase
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    var verify = req.body.passwordverify;
    
    //Seraches the databse for the users email
    db.collection('users').findOne({"email":email}, function(err, result){

        //Checks to see if the user already exists
        if(!result){

            //Checks if both password enetered match
            if(password == verify){

                //If both these conditions are met the data is saved to the database
                var data = {
                    "name": req.body.name,
                    "email": req.body.email.toLowerCase(),
                    "password": req.body.password
                }
            
                db.collection('users').save(data, function(err, result){
            
                    if(err) throw err;
                    req.session.loggedin = true; 
                    req.session.useremail = email;
                    res.redirect('/account')
            
                })
            
            //Redirects the user to the login page if either condition isnt met
            }else{res.redirect('/login')};

        }else{res.redirect('/login')};

    });

});

//Creates the route to log the user out
app.get('/logout', function(req, res){

    //Sets the sessions variable loggedin to false and redirects the user to the login page to show theyve been logged out
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/login');

})

// Recieves post reques from map or mspLoggedIn page
app.post('/teamCheckBoxes', function(req, res) {
    var query = {email: req.session.useremail}//Finds exclusive email associated with the user and stores in variable
    var newValues = {$set:{//stores the data recieved
        teams: req.body.checkboxstatus
        }
    }
    if(req.session.loggedin){//Only if user is logged in the data is stored to the database
        db.collection('users').updateOne(query,newValues, function(err, result){//Updates the logged in users data in the database with the new map selections from the post request.
            if(err) throw err;
            res.redirect('/')
        })
    }
});
