require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api')

var spotify = new Spotify(keys.spotify);
exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};
//var client = new Twitter(keys.twitter);

var searchType = process.argv[2]
var searchQuery = [];
for (i = 3; i < process.argv.length; i++){
    searchQuery = searchQuery + (process.argv[i]) + "+"
 }

//OMDB request//
var movieLookup = function(){
    var queryUrl = "http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=aa361df7";
    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
            console.log("Movie Title: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating +
            "\nRotten Tomatoes Rating :" + JSON.parse(body).Source + "\nProduced in: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +
            "\nStarring: " + JSON.parse(body).Actors);
            console.log(searchQuery)
        }
    })
}

var spotifyLookup = function(){
    spotify.request('https://api.spotify.com/v1/song/' + searchQuery)
    .then(function(data) {
      console.log(data); 
      console.log(spotify)
    })
    .catch(function(err) {
      console.error('Error occurred: ' + err); 
      console.log(spotify)
    });
}


if (searchType === "movie-this"){
    movieLookup()
}
if (searchType === "spotify-this-song"){
     spotifyLookup()
}
//if (searchType === 'my-tweets'){
//    tweetLookup()
//}
//if (searchType === "do-what-it-says"){
//    doIt()
//}