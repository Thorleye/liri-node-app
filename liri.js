require("dotenv").config();

var keys = require("./keys")
var request = require("request")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var searchType = process.argv[2]


//OMDB request//
var movieLookup = function(){
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
var movieName = []
for (i = 3; i < process.argv.length; i++){
   movieName.push(process.argv[i])
}


    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);
    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
            console.log(body)
            console.log("The movie's release year is: " + JSON.parse(body).Year);
        }
    })
}

if (searchType === "movie-this"){movieLookup()}