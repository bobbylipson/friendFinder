var friends = require("../data/friends.js");
var path = require('path');

module.exports = function (app) {

    app.get("/api/friends", function(req, res) {
        res.json(friends);
    });

    app.post("/api/friends", function(req, res) {

        var bestMatch = {
            name: "",
            photo: "",
            friendDifference: 1000
        };

        console.log(req.body);

        // Here we take the result of the users survey POST and parse it.
        var userData = req.body;
        var userScores = userData.scores;

        console.log(userScores); // this is the issue, doesn't know what this is

        // This variable will calculate the difference b/w the users scores and the scores of each user in the database
        
        var totalDifference = 0;

        // Here we loop thru all the friend possibilities in the database
        for (var i = 0; i < friends.length; i++) {

            console.log(friends[i]);
            totalDifference = 0;

            // We then loop thru all the scores of each friend
            for (var j = 0; j < friends[i].scores[j]; j++) {

                // We calculate the difference b/w the scores and sum them into the totalDifference
                totalDifference += Math.abs(parseInt(userScores[j]) - parseInt(friends[i].scores[j]));

                // If the sum of differences is less than the differences of the current best match
                if (totalDifference <= bestMatch.friendDifference) {

                    // Reset the bestMatch to be the new friend.
                    bestMatch.name = friends[i].name;
                    bestMatch.photo = friends[i].photo;
                    bestMatch.friendDifference = totalDifference;
                }
            }
        }

        // Finally save the users data to the database (this has to happen after the check, otherwise the database will always return that the use is the users best friend)

        friends.push(userData);

        // Return a JSON with the users bestMatch. this will be used by the HTML in the next page
        res.json(bestMatch);
    });

}