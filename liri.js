require("dotenv").config();
//variable storing fs which is an acronym for File System
var fs = require('fs');
//variable storing omdb stuff
var request = require('request');
//variable storing twitter stuff
var twitter = require('twitter');
//variable storing spotify stuff
var spotify = require('spotify');
//variable storing the keys
var keys = require('./keys.js').twitter;
console.log(keys);

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//variable storing index 2 of the process.argv array for an actionable use later
var action = process.argv[2];
//variable storing index 3 of process.argv array for parameters to the action
var arg = process.argv[3];

//get Tweets Function
var getTweets = function getTweets() {
  //using the twitter keys gather the last 20 tweets from my account
  twitter(keys).get('statuses/user_timeline', 'count=20', function(error, tweets, response) {
    // console.log last 20 tweets and when they were created
    if (error) {
      //if an error is thrown show this message
      console.log('Couldn\'t access your tweets!');
    } else {
      //for each tweet log the timestamp and tweet message
      tweets.forEach(function(tweet) {
        console.log(tweet.created_at + ": " + tweet.text);
      });
    }
  });
}
//function retrieving songs from spotify
var getSong = function getSong(song) {
  //if song is undefined play "The Sign"
  if (song === undefined) {
      song = "The Sign";
  }
  //search spotify for the Track and song name
  spotify.search({type: 'track', query: song }, function(error, response) {
    if (error) {
      //if error is thrown log this message
      console.log('There was an issue finding that song', error);
    } else {
      // console.log(response);
      //log all song data
      response.tracks.items.forEach(function(song) {
        console.log('Song name:', song.name);
        console.log('Artist:', song.album.artists[0].name);
        console.log('Spotify preview URL:', song.preview_url);
        console.log('Album:', song.album.name);
        console.log('---');
      });
    }
  });
}
//variable storing find movie function
var getMovie = function getMovie(movie) {
  //if movie shows undefind retrieve "Mr. Nobody" as default
  if (movie === undefined) {
    movie = "Mr. Nobody";
  }
  //variable to search OMDB
  var qUrl = 'http://www.omdbapi.com/?t=' + movie;
  request(qUrl, function(error, response, body) {
    if (error) {
      console.log('There was an issue finding that movie', error);
    } else {
      //if no errors thrown log the following about the movie
      //flick is the variable to store the JSON parse
      flick = JSON.parse(body);
      console.log('Title:', flick.Title);
      console.log('Released:', flick.Year);
      console.log('IMDB rating:', flick.Ratings[0].Value);
      console.log('Country of origin:', flick.Country);
      console.log('Language:', flick.Language);
      console.log('Plot', flick.Plot);
      console.log('Actors:', flick.Actors);
      console.log('Rotten Tomatoes rating:', flick.Ratings[1].Value);
    }
  });
}

var doThing = function doThing() {
  // get arguments from random.text
  var randAction, randArgument;
  //pull data from random.txt file
  fs.readFile('./random.txt', 'utf-8', function(error, data) {
    //split the data into an array
    var arr = data.split(',');
    randAction = arr[0];
    randArgument = arr[1];
    actions[randAction](randArgument);
  });
}
//these are the commands to run the search parameters
var actions = {
  'my-tweets': getTweets,
  'spotify-this-song': getSong,
  'movie-this': getMovie,
  'do-what-it-says': doThing
}

actions[action](arg);
