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
  const user = parseInt(req.query.userid);

  try {
    await rbx.handleJoinRequest(groupId, user, true); // Accept join request
    res.json("Join request accepted!");
  } catch (error) {
    res.json("Error accepting join request: " + error.message);
  }
});

// /checkJoinRequest endpoint to check if a join request exists (with pagination)
app.get("/checkJoinRequest", async (req, res) => {
  const userId = parseInt(req.query.userid);

  try {
    let found = false;
    let cursor = null;

    do {
      const result = await rbx.getJoinRequests(groupId, cursor);
      const requests = result.data || [];

      if (requests.some(req => req.userId === userId)) {
        found = true;
        break;
      }

      cursor = result.nextPageCursor;
    } while (cursor);

    if (found) {
      res.json("Join request exists for this user.");
    } else {
      res.json("No join request found for this user.");
    }
  } catch (error) {
    res.json("Error checking join request: " + error.message);
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
