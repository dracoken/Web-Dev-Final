//const { PrismaClient } = require("@prisma/client");
const { PrismaClient } = require('@prisma/client')
const express = require("express");
const bodyParser = require('body-parser'); //allows us to read an inturpt the data from the body of a post request
const path = require("path");
const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.json());
//app.use(express.json({extended: true, limit: '1mb'}));  // i dont think i need to restrict the data's size at all yet
app.use(bodyParser.json());

//look up how to do a delivery of static content on express
//app.use(express.static('public'));
app.use('/assests', express.static(path.join(__dirname, '/public')));

app.get("/", (req,res) =>
{
    //index = fetch()
    res.sendFile(path.join(__dirname , 'public/htmlFiles/combatScene.html'));
    //res.sendFile(path.join(__dirname+"/LoginAndRegistration/index.html"));
})

app.post("/register",express.json(), async (req,res) => {
    //console.log("in register api");
    //const {username,password} = req.body; //can do it this way or call it the other way which is commented below
    //console.log("username = " + username);
    //console.log("password =  " + password);

    let requestUsername = req.body.username;
    let requestPassword = req.body.password;
    //console.log("requestUsername = " + requestUsername);
    //console.log("requestPassword = " + requestPassword);

    try
    {
        const newAccount = await prisma.user.create({
            data:
            {
                userName:requestUsername,
                password:requestPassword,
            }
        })
        console.log(newAccount);
        res.status(200);
    }
    catch(error)
    {
        console.log("dup username");
        res.status(400).json({error:"username is already taken"});
        return;
    }
});

app.get("/login/:username/:password", express.json(), async (req,res) =>
{
    const loginUsername = req.params.username;
    const loginPassword = req.params.password;
    console.log("username = " + loginUsername);
    console.log("password = " + loginPassword);

    try
    {
        const loginAttempt = await prisma.User.findFirst({
            where:
            {
                userName:loginUsername,
                password:loginPassword,
            }
        });
        console.log(loginAttempt);
        if(loginAttempt == null)
        {
            throw new error;
        }
        res.status(200).json({data:loginAttempt});
    }
    catch(error)
    {
        console.log("invaild credentials");
        res.status(400).json({error:"invaild credentials"});
        return;

    } 
});

// app.post("/fillEmptyGames", express.json(), async (req,res)=>
// {
//     let playerUsername = req.body.username;

//     try
//     {
//         //checking to see if there are any matches that are still waiting to be filled
//         let notFullGame = prisma.match.findFirst(
//             {
//                 where:
//                 {
//                     matchStarted:false,
//                 },
//             },
//         );
//         if(notFullGame == null) //happens if their is no games lobbys abvailble,
//         {

//         }
//     }
//     catch(error)
//     {
//         console.log("error?");
//     }

// });


app.listen(port)
{
    console.log("listiening on port " + port);
}

//we will just do the rest of the api routes in here