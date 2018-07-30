var dotevn = require("dotenv").config();
var keys = require("./keys");
var request = require("request");

//var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);

var searchType = process.argv[2]


//OMDB request//
var movieLookup = function(){
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
var movieName = [];
for (i = 3; i < process.argv.length; i++){
   movieName.push(process.argv[i])
}
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
            console.log("Movie Title: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating +
            "\nRotten Tomatoes Rating :" + JSON.parse(body).Source + "\nProduced in: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +
            "\nStarring: " + JSON.parse(body).Actors);
        }
    })
}

if (searchType === "movie-this"){
    movieLookup()
}