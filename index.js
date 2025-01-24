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
  console.log(`Logged in as ${currentUser.name}`);
}
startApp();

// /accept endpoint to handle accepting join requests
app.get("/accept", async (req, res) => {
  const user = req.query.userid;

  try {
    await rbx.handleJoinRequest(groupId, parseInt(user), true); // Accept the request
    res.json("Accepted the join request!");
  } catch (error) {
    res.json("Error accepting join request: " + error.message);
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
