require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require('fs');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var searchType = process.argv[2];
var searchQuery = process.argv[3];
for (i = 4; i < process.argv.length; i++){
    searchQuery = searchQuery + "+" + (process.argv[i]) 
 }

var tweetLookup = function(){
    var params = {screen_name: 'lirinodeproject'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error){
            console.log("error:" + error);
        }
        if (!error) {
            console.log("Liri node apps official tweets:");
            for (i=0; i < tweets.length; i++){
                console.log("\n" + tweets[i].text + "   | Tweeted on: " + tweets[i].created_at);
            }
        }
    });
}

var movieLookup = function(){
    if (!searchQuery || searchQuery === undefined){
        searchQuery = "Mr.+Nodody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=aa361df7";
    request(queryUrl, function(error, response, body){
        if (error){
            console.log("error: " + error);
        }
        if (!error && response.statusCode === 200) {
            console.log("Movie Title: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating +
            "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nProduced in: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +
            "\nStarring: " + JSON.parse(body).Actors);
            fs.appendFile("random.txt", ","+ searchType + " " + searchQuery, (error) => {
                if (error) {console.log('error:' + error) }
            });
        }
    })
}

var spotifyLookup = function(){
    if (!searchQuery || searchQuery === undefined){
        searchQuery = "The+Sign";
    }
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
            console.log("Preview: " + information.preview_url);
            fs.appendFile("random.txt", ","+ searchType + " " + searchQuery, (error) => {
                if (error) {console.log("error: " + error)}
            })
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
}

var doIt = function(){
    fs.readFile("random.txt", 'utf8', function(err, data){
        if (err){
            console.log("error: " + err);
        }
        var terms = data.split(',')
        var termsArray = [terms[0], terms[1]];
            if (termsArray[0] === "movie-this"){
                searchQuery = termsArray[1];
                movieLookup();
            }
            if (termsArray[0] === "spotify-this-song"){
                searchQuery = termsArray[1];
                spotifyLookup();
           }

    })
}

if (searchType === "movie-this"){
    movieLookup();
}
else if (searchType === "spotify-this-song"){
     spotifyLookup();
}

else if (searchType === 'my-tweets'){
    tweetLookup();
}

else if (searchType === "do-what-it-says"){
    doIt();
}
else {console.log("Commands are: movie-this , spotify-this-song , my-tweets & do-what-it-says")};