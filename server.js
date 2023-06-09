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
app.use(bodyParser.json());

app.use('/assests', express.static(path.join(__dirname, '/public')));

app.get("/", (req,res) =>
{
    //index = fetch()
    //res.sendFile(path.join(__dirname , 'public/htmlFiles/combatScene.html'));
    res.sendFile(path.join(__dirname, "public/htmlFiles/index.html"));
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
        window.location.href = "public/htmlFiles/combatScene.html";
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

        console.log(loginAttempt.userName);
        return res.status(200).json({success: "loged in successfully",playerId: loginAttempt.userName});
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

    console.log("in findGame endpoint");
    let requestUsername = req.body.username; //this represents the queued player's id.
    let newGame;
    //console.log("userName = " + requestUsername);
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

    const inGame = await prisma.Match.findFirst({ //well look over this code in a bit
        where:
        {
            matchStarted: true,
            matchDone: false,
            players:
            {
                some:
                {
                    userName: player.userName,
                },
            },
        },
        include:
        {
            players: true,
        },
    });
    //console.log("in game = ");
    //console.log(inGame);
    if(inGame != null && inGame.matchDone == false)
    {
        return res.status(409).json({error:"player is currently in game " + inGame.id, gameDets: inGame})
    }

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
    //console.log("availbleGame = ");
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
        //console.log(newGame); //it creates a new match with the queue player in it, in the case where no abavile matches are present
        return res.status(200).json({success:"match dosen't have enough players to start the match, waiting on second player to join"});
    }
    //console.log("testing");
    //console.log(availableGame);

    if(availableGame.players[0].userName == requestUsername) //checks if player is trying to join the same match for the second time, and rejects the request
    {
        console.log("player tried to join same game twice");
        return res.status(400).json({error:"player can't join the same game twice"});
    }
    console.log("creating new game");
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
    console.log(newGame);
    return res.status(200).json({success:"match has started"})
    //redirect to combat page
});

app.get("/getGameDetails/:userId", express.json(), async (req,res) => {
    //console.log("inside getGameDetails");
    const user = req.params.userId;

    const game = await prisma.Match.findFirst({
        where:
        {
            players: 
            {
                some:
                {
                    userName: user,
                },
            },
        },
        include: 
        {
            players:true,
        }
    });
    //console.log(game);
    if(game == null)
    {
        return res.status(400).json({error:"user is not in a game"});
    }
    return res.status(200).json(game);
});

app.get("/getCurrentHp/:username", express.json(), async (req,res)=>{
    console.log("in getCurrentHp call");
    const playerUsername = req.params.username;
    console.log("playerUsername is = " + playerUsername);

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
    //console.log(player);
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
    console.log("inside change currentHP");
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
    if(playerNewHP <= 0) //if player is dead
    {
        console.log("player died");
        // playerUpdate = await prisma.User.update({ //updates the user's hp to the hp that was assigned to in the fetch request
        //     where:
        //     {
        //         userName: playerUserName,
        //     },
        //     data:
        //     {
        //         currentHp:player.hp, //change this to the player original value
        //     },
        // });

        matchUpdate = await prisma.Match.update({
            where:
            {
                id: player.matchId,
            },
            data:
            {
                matchStarted: true,
                matchDone: true,
            },
            include:
            {
                players: true,
            },
        });

        const p1Name = matchUpdate.players[0].userName;
        const p1DefaultHp = matchUpdate.players[0].hp;

        const p2Name = matchUpdate.players[1].userName;
        const p2DefaultHp = matchUpdate.players[1].hp;

        console.log("match before");
        console.log(matchUpdate);


        const p1 = await prisma.User.update({ //resetting player1 to their default hp
            where:
            {
                userName: p1Name,
            },
            data: 
            {
                currentHp: p1DefaultHp,
            },
        });
    
        const p2 = await prisma.User.update({ //reseting player2 to their default hp
            where: 
            {
                userName: p2Name,
            },
            data: 
            {
                currentHp: p2DefaultHp
            },

        });

        
        console.log("match after");
        console.log(matchUpdate);

        

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

app.post("/endTurn", express.json(), async (req,res) =>{ //its assumed that the player id being sent. that it is their current turn, and that its about to end

    if(req.method != "POST")
    {
       return res.status(400).json({error: "method sent in promise, was not a post method"});
    }

    const playerId = req.body.playerId; //id sent is actually the username sorry
    const gameId = req.body.gameId;
    console.log("gameId = " + gameId);
    let game;
    game = await prisma.Match.findFirst({
        where:
        {
            id: parseInt(gameId),
        },
        include:
        {
            players: true,
        }
    });
    console.log("game in end turn = ");
    console.log(game);
    if(game == null)
    {
        return res.status(400).json({error:"game was not found"});
    }

    //checks if playerId sent is player one, or is player 2. to change the turn correctly
    if(game.players[0].userName == playerId)
    {
        console.log("player1 is ending their turn");
        console.log("changing to make it player's 2 turn");

        game = await prisma.Match.update({
            where:
            {
                id:parseInt(gameId),
            },
            data:
            {
                player1Turn: false,
            },
            include:
            {
                players:true,
            }
        });
        console.log(game);
    }
    if(game.players[1].userName == playerId)
    {
        console.log("player2 is ending their turn");
        console.log("changing to make it player's 1 turn");

        game = await prisma.Match.update({
            where:
            {
                id:parseInt(gameId),
            },
            data:
            {
                player1Turn: true,
            }
        });
        console.log(game);
    }
    return res.status(200).json(game);

})


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
        },
       include:
       {
            players:true,
       }
    });

    if(game == null)
    {
        res.status(400).json({error: "match doesn't exist"});
        return;
    }

    const p1Name = game.players[0].userName;
    const p1DefaultHp = game.players[0].hp;

    const p2Name = game.players[1].userName;
    const p2DefaultHp = game.players[1].hp;


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

    const p1 = await prisma.User.update({ //resetting player1 to their default hp
        where:
        {
            userName: p1Name,
        },
        data: 
        {
            currentHp: p1DefaultHp,
        },
    });

    const p2 = await prisma.User.update({ //reseting player2 to their default hp
        where: 
        {
            userName: p2Name,
        },
        data: 
        {
            currentHp: p2DefaultHp
        },
    });
    return res.status(200).json({error:"game ended abruptly, cancelling game"});    
});

app.listen(port)
{
    console.log("listiening on port " + port);
}
