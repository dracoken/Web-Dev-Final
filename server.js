const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req,res) =>
{
    console.log("test");
    res.send("/index.html");
    //res.render("/pages/index.html");
})

app.listen(port)
{
    console.log("listiening on port " + port);
}