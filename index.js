const express = require("express");
const rbx = require("noblox.js");
const app = express();

// Using environment variables
var groupId = process.env.GROUP_ID;
var cookie = process.env.COOKIE;

app.use(express.static("public"));

async function startApp() {
  await rbx.setCookie(cookie);
  let currentUser = await rbx.getAuthenticatedUser();
  console.log(currentUser.name);
}
startApp();

// /ranker endpoint to rank a user
app.get("/ranker", async (req, res) => {
  const user = parseInt(req.query.userid);
  const rank = parseInt(req.query.rank);

  try {
    await rbx.setRank(groupId, user, rank);
    res.json("Ranked!");
  } catch (error) {
    res.json("Error setting rank: " + error.message);
  }
});


// /joinRequest endpoint to accept a join request
app.get("/joinRequest", async (req, res) => {
  var user = req.query.userid;

  try {
    await rbx.handleJoinRequest(groupId, parseInt(user), true); // Accept join request
    res.json("Join request accepted!");
  } catch (error) {
    res.json("Error accepting join request: " + error.message);
  }
});

// /checkJoinRequest endpoint to check if a join request exists
app.get("/checkJoinRequest", async (req, res) => {
  var user = parseInt(req.query.userid);

  try {
    let result = await rbx.getJoinRequests(groupId); // result is an object
    let requests = result.data || []; // grab the array of requests

    let joinRequestExists = requests.some(request => request.userId === user);

    if (joinRequestExists) {
      res.json("Join request exists for this user.");
    } else {
      res.json("No join request found for this user.");
    }
  } catch (error) {
    res.json("Error checking join request: " + error.message);
  }
});
