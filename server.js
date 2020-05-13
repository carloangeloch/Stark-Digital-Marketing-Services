//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const https = require('https');
const request = require('request');

// app.use('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req,res) => {

  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const thisEmail = req.body.email;

  var data = {
    members: [
      {
        email_address: thisEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsondata = JSON.stringify(data);

  const url = process.env.URL;
  const option  = {
    method: "POST",
    auth: process.env.APIKEY
  };

  const request = https.request(url, option, function (response) {

    if(response.statusCode === 200){
      res.sendFile(__dirname + '/success.html');
    }else{
      res.sendFile(__dirname + '/failure.html');
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsondata);
  request.end();
  
});

app.listen(process.env.PORT || 5000, () => console.log(`Server running at port 5000`));