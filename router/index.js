const router = require("express").Router();
const tweets = require("./tweets");

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.use("/elonmusk", tweets);

module.exports = router;
