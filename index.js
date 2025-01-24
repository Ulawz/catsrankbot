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

// /joinrequest endpoint to handle accepting or declining join requests
app.get("/joinrequest", async (req, res) => {
  const userId = req.query.userid; // Get user ID from query params
  const accept = req.query.accept === "true"; // Get accept parameter, ensure it's a boolean

  try {
    await rbx.handleJoinRequest(groupId, parseInt(userId), accept); // Handle join request
    res.json(accept ? "Accepted the join request!" : "Declined the join request!");
  } catch (error) {
    res.json("Error handling join request: " + error.message);
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
