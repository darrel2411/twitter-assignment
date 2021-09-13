const router = require("express").Router();
const Controller = require("../Controllers/tweetController");

router.get("/tweets", Controller.allTweet);
router.get("/find", Controller.getElon);

module.exports = router;
