const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

//look up how to do a delivery of static content on express
//app.use(express.static('public'));
app.use('/assests', express.static(path.join(__dirname, '/public')));

app.get("/", (req,res) =>
{
    //index = fetch()
    res.sendFile(path.join(__dirname , 'public/htmlFiles/index.html'));
    //res.sendFile(path.join(__dirname+"/LoginAndRegistration/index.html"));
})

//ToDo
app.post("/register", (req,res) => {
    const regDetails = req.body();
});

app.listen(port)
{
    console.log("listiening on port " + port);
}

//we will just do the rest of the api routes in here