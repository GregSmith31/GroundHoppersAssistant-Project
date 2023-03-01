/**
 * @Author: John Isaacs <john>
 * @Date:   23-Jan-192019
 * @Filename: SimpleServer.js
 * @Last modified by:   john
 * @Last modified time: 25-Jan-192019
 */

//LOOK AT LINES:  74, 90, 94-100, 116, 120-126

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 8080;

http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  var ext = path.parse(pathname).ext;
    if(ext ==''){ext = '.html'}
  // maps file extention to MIME typere
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };

  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found! remember to include the full path to your file, e.g https://wibble-wobble-8080.codio.io/lab_1/test.html`);
      return;
    }

    // if is a directory search for index file matching the extention
    if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });


}).listen(parseInt(port));

console.log(`Simple Server is listening for requests on port ${port}`);

//MongoDB
const MongoClient = require('mongodb').MongoClient;
//TODO - Add number after : and db name after /
const url = "mongodb://localhost:/"
const express = require('express');
const app = express();

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

var db;

MongoClient.connect(url, function(err, database){
  if(err) throw err;
  db = database;
  app.listen(8080);
});

app.get('/all', function(req, res){
  //TODO - Name db collection
  db.collection('users').find().toArray(function(err, result){
    if (err) throw err;

    //TODO - Add output
    var output = " "

    for(var i = 0; i < result.length; i++){
      output += "<div>"
      output += "<h3>" + result[i].? + "</h3>" 
      output += "<p>" + result[i].? + "</p>" 
    }
    res.send(output);
  })
})

app.post('/register', function (req, res){
  db.collection('users').save(req.body, function(err, result)){
    if (err) throw err;
    console.log('Added to database')
    res.redirect('/')
  }
})

app.get('/search', function(req, res){
  //TODO - Name db collection
  db.collection('users').find(req.body).toArray(function(err, result){
    if (err) throw err;

    //TODO - Add output
    var output = " "

    for(var i = 0; i < result.length; i++){
      output += "<div>"
      output += "<h3>" + result[i].? + "</h3>" 
      output += "<p>" + result[i].? + "</p>" 
    }
    res.send(output);
  })
})