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
    res.sendFile(path.join(__dirname , 'public/htmlFiles/combatScene.html'));
    //res.sendFile(path.join(__dirname, "public/htmlFiles/index.html"));
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
    if(req.method != "POST")
    {
        return res.status(400).json({error:"invaild rest method"});
    }

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
        return res.status(200).json({success:"signed up successfully"});
    }
    catch(error)
    {
        //console.log("dup username");
        return res.status(400).json({error:"username is already taken"});
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
        //console.log(loginAttempt);
        if(loginAttempt == null)
        {
            throw new error;
        }
        return res.status(200).json({success: "loged in successfully"});
        //return res.status(200).json(loginAttempt); //returns all the data of the user, including the password
    }
    catch(error)
    {
        return res.status(400).json({error:"invaild credentials"});
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
        return res.status(404).json({error: "user dosen't exist in db"}); //should this be a status of 400 or 404?
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
        //console.log("inside no game abvailble case");
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
        return res.status(200).json({success:"match dosen't have enough players to start the match, waiting on second player to join"});
    }
    if(availableGame.players[0].userName == requestUsername) //checks if player is trying to join the same match for the second time, and rejects the request
    {
        return res.status(400).json({error:"player can't join the same game twice"});
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
    //console.log(newGame);
    return res.status(200).json({success:"match has started"});
});

app.get("/getCurrentHp/:username", express.json(), async (req,res)=>{
    //console.log("in getCurrentHp call");
    const playerUsername = req.params.username;
    console.log("playerUsername = " + playerUsername);

    const player = await prisma.User.findUnique({
        where:
        {
            userName:playerUsername,
        },
        select:
        {
            userName: true,
            currentHp: true,
            str: true,
            def: true,
            dex: true,
            matchId: true,
        }
    });
    console.log(player);
    if(player == null)
    {
        return res.status(400).json({error:"player dosen't exist"});
    }
    return res.status(200).json({playerData:player});
    //return res.status(200).json({player});
});

app.post("/changeCurrentHp", express.json(), async (req,res) =>{
    const playerUserName = req.body.username;
    const playerNewHP = req.body.hp;
    let playerUpdate;
    //console.log("player username = " + playerUserName);
    //console.log("hp sent = " + playerNewHP);
    if(req.method != "POST")
    {
        return res.status(400).json({error: "wrong method"});
    }
    const player = await prisma.User.findUnique({
        where:
        {
            userName:playerUserName,
        }
    });
    if(player == null)
    {
        return res.status(400).json({error: "player can't be found"});
    }

    if(playerNewHP <= 0)
    {
        playerUpdate = await prisma.User.update({ //updates the user's hp to the hp that was assigned to in the fetch request
            where:
            {
                userName: playerUserName,
            },
            data:
            {
                currentHp:player.hp, //change this to the player original value
            },
        });

        matchUpdate = await prisma.Match.update({
            where:
            {
                id: player.matchId,
            },
            data:
            {
                matchStarted: true,
                matchDone: true,
            }
        });
        return res.status(200).json({success: "match done"});
    }

    playerUpdate = await prisma.User.update({ //updates the user's hp to the hp that was assigned to in the fetch request
        where:
        {
            userName: playerUserName,
        },
        data:
        {
            currentHp: parseInt(playerNewHP),
        },
    });
    //console.log(playerUpdate);
    return res.status(200).json({success:"hp changed successfully"});
});

app.post("/abruptGameEnd", express.json(), async (req,res)=>{ //changes the 
    const gameId = req.body.id;
    let game;

    if(req.method != "POST")
    {
        return res.status(400).json({error:"wrong method type"});
    }

    game = await prisma.Match.findUnique({
        where: 
        {
            id:gameId,
        }
    });
    if(game == null)
    {
        res.status(400).json({error: "match doesn't exist"});
        return;
    }
    game = await prisma.Match.update({
        where:
        {
            id: gameId,
        },
        data:
        {
            matchDone: true,
        }
    });
    const player1 = game.players[0];
    const player2 = game.players[1];
    console.log("testing if get player 1 inside match")
    console.log(player1);
    return res.status(200).json({error:"game ended abruptly, cancelling game"});    
});

app.listen(port)
{
    console.log("listiening on port " + port);
}
