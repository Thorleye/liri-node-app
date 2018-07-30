require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api')
var fs = require('fs')
var Twitter = require('twitter')

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var searchType = process.argv[2]
var searchQuery = process.argv[3];
for (i = 4; i < process.argv.length; i++){
    searchQuery = searchQuery + "+" + (process.argv[i]) 
 }

var tweetLookup = function(){
    var params = {screen_name: 'lirinodeproject'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error){
            console.log("error:" + error)
        }
        if (!error) {
            for (i=0; i < tweets.length; i++){
                console.log("\n" + tweets[i].text + "   | Tweeted on: " + tweets[i].created_at)
            }
        }
    });
}

var movieLookup = function(){
    console.log("Query:" + searchQuery)
    if (searchQuery == undefined){searchQuery = "Mr.+Nodody"}
    var queryUrl = "http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=aa361df7";
    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log("Movie Title: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating +
            "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nProduced in: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +
            "\nStarring: " + JSON.parse(body).Actors);
            fs.appendFile("random.txt", ","+ searchType + " " + searchQuery)
        }
    })
}

var spotifyLookup = function(){
    if (searchQuery === ""){searchQuery === "The+Sign"}
    spotify.search({ type: 'track' , query: searchQuery, limit: 1})
        .then(function(data) {
        var information = data.tracks.items[0];
        console.log("Song Name: " + information.name);
        var artists = "";
        for (i=0; i < information.artists.length; i++){
            var artists = artists + information.artists[i].name + ", ";
        } 
        console.log("artist(s): " + artists);
        console.log ("Off of the album: " + information.album.name); 
        console.log("Preview: " + information.preview_url)
        fs.appendFile("random.txt", ","+ searchType + " " + searchQuery)
        })
        .catch(function(err) {
        console.error('Error occurred: ' + err); 
        });
}

var doIt = function(){
    fs.readFile("random.txt", 'utf8', function(err, data){
        if (err){
            console.log("error: " + err)
        }
        var terms = data.split(',')
        var termsArray = [terms[0], terms[1]]
            if (termsArray[0] === "movie-this"){
                movieLookup(termsArray[1])
            }
            if (termsArray[0] === "spotify-this-song"){
                spotifyLookup(termsArray[1])
           }

    })
}

if (searchType === "movie-this"){
    movieLookup()
}
if (searchType === "spotify-this-song"){
     spotifyLookup()
}

if (searchType === 'my-tweets'){
    tweetLookup()
}

if (searchType === "do-what-it-says"){
    doIt()
}