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

// /ranker endpoint with updated query parameter handling
app.get("/ranker", async (req, res) => {
  var user = req.query.userid;
  var rank = req.query.rank;

  try {
    await rbx.handleJoinRequest(groupId, parseInt(user), true);
    res.json("Ranked!");
  } catch (error) {
    res.json("Error setting rank: " + error.message);
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
