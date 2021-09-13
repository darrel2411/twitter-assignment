require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const router = require("./router/index");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// router
app.use(router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
