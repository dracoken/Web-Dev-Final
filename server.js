//const { PrismaClient } = require("@prisma/client");
const { PrismaClient } = require('@prisma/client')
const express = require("express");
const bodyParser = require('body-parser'); //allows us to read an inturpt the data from the body of a post request
const path = require("path");
const exp = require('constants');
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
    res.sendFile(path.join(__dirname , 'public/htmlFiles/index.html'));
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

app.post("/findGame", express.json(), async (req,res)=>{ 
    //updates the db with a new match and link the current player with it, if none are avavible.
    // If a match is abvailble then it'll link the player with that match
    //checks if a match has 2 players or not. if it has 2 then its consisdered unabvaile and moves onto the next match. 
    //if match already has a player, then we update the match with the queued player, and the update that match to say its in progress, and create a new match record to the data base.
    //const player = req.params.username; //player in the queue/lobby to join a match that still needs more players to join it

    let requestUsername = req.body.username; //this represents the queued player's id.
    let newGame;
    console.log("userName = " + requestUsername);
    const player = await prisma.user.findUnique({
        where: 
        {
            userName: requestUsername,
        }
    });
    if(player == null) //case where player dosen't exist
    {
        console.log("player dosen't exist");
        res.status(404).json({error: "user dosen't exist in db"}); //should this be a status of 400 or 404?
        return;
    }
    //console.log(player); //it grabs the player correctly

    
    const availableGame = await prisma.Match.findFirst({ //finds first abvaible match, that needs a player to start
        where: {
            matchStarted: false,
            matchDone: false,
        },
        include:
        {
            players:true,
        }
    });
    //console.log("no games availble = ");
    //console.log(availableGame);
    if(availableGame == null) //case in which no games exists(we create new game and update it with the queuedPlayer)
    {
        console.log("inside no game abvailble case");
        newGame = await prisma.Match.create({
            data: {
                matchStarted: false,
                matchDone: false,
                players:
                {
                    connect:
                    {
                        id:player.id,
                    }
                }
            },
            include:
            {
                players: true,
            }
        });
        console.log(newGame); //it creates a new match with the queue player in it, in the case where no abavile matches are present
        res.status(200).json({error:"match dosen't have enough players to start the match, waiting on second player to join"});
        return;
    }
    if(availableGame.players[0].userName == requestUsername) //checks if player is trying to join the same match for the second time, and rejects the request
    {
        res.status(400).json({error:"player can't join the same game twice"});
        return;
    }

    newGame = await prisma.Match.update({ //adds the new player into the match
        where:
        {
            id:availableGame.id,
        },
        data:
        {
            matchStarted:true,
            players: 
            {
                //appends the player to the list.
                //however in the case where the player is already in the current match, it wont add anyone to the list,
                // keeping the list as 1 player, but labeling that match as started.
                //therefore we need to have a test case before this, that checks if they are already currently inside the match's list
                connect: 
                {
                    id:player.id,
                },
            }
        },
    });
    res.status(200).json({success:"match has started"});
    return;
    //console.log(newGame);
});


app.listen(port)
{
    console.log("listiening on port " + port);
}

//we will just do the rest of the api routes in here