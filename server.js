const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

//look up how to do a delivery of static content on express
/*
app.use()
{

}
*/
app.get("/", (req,res) =>
{
    res.sendFile(path.join(__dirname+"/LoginAndRegistration/index.html"));
})

app.listen(port)
{
    console.log("listiening on port " + port);
}

//we will just do the rest of the api routes in here