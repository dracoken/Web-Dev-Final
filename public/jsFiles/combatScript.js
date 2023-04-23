console.log("inside CombatScript")
/*
const attack = document.querySelector('#attack');
const surrender = document.querySelector('#surrender');
const leftPlayer = document.querySelector('left-player');
const rightPlayer = document.querySelector('right-player');
const rightPic = document.querySelector('#rightCharImg');
let leftPic = document.querySelector("#leftCharImg");

const button = document.getElementById('attackBtn')
*/

let gameDetails;
let gameId;
let user; //username of the user
let userCharacter;
let oppoent; //username of the oppoent
let p1;  //is more of a place holder to know who is player 1 at all times
let isYourturn = true;



window.onload = async() => {
  //console.log("searching for match")
  user = localStorage.getItem("username");
  //console.log("user = " + user);

  const matchMaking = await fetch("/findGame",
  {
      method:"POST",
      headers:{            
          "Content-Type": "application/json",
      },
      body:JSON.stringify({
          username: user,
      }),
  });
  if(matchMaking.status === 200)
  {
      const message = await matchMaking.json();
      console.log(message.success);
      ///console.log("MATCH FOUND");
  }
  if(matchMaking.status === 400)
  {
      const errorMessage = await matchMaking.json();
      console.log(errorMessage.error);
  }
  if(matchMaking.status === 409) //happens in the case where the player is already inside a game
  {
    alert("rejoining game");
    const data = await matchMaking.json();
    gameId = data.gameDets.id;
    gameDetails = data.gameDets;
    if(data.gameDets.players.length == 2)
    {
      if(user == data.gameDets.players[0].userName)
      {
        console.log("player1");
        userCharacter = data.gameDets.players[0];
        oppoent = data.gameDets.players[1].userName; //oppenent is p2, user is p1
        p1 = data.gameDets.players[0].userName; //just so we know who player 1 at all times
        if(data.gameDets.player1Turn == true) //checks whos turn it is, at any point in a match after rejoining
        {
          isYourturn = true;
        }
        else
        {
          isYourturn = false;
        }
      }
      if(user == data.gameDets.players[1].userName) //oppoent is p1, user is p2
      {
        console.log("player2");
        userCharacter = data.gameDets.players[1];
        oppoent = data.gameDets.players[0].userName;
        p1 = data.gameDets.players[0].userName; //just so we know who player 1 at all times. p1 = oppoent

        if(data.gameDets.player1Turn == true)
        {
          isYourturn = false;
        }
        else
        {
          isYourturn = true;
        }
      }
    }
    else
    {
      p1 = user;
    }
  }

  loadData();


}

async function updateStats() {
  //console.log("updating player stats")
  document.getElementById("atkname").innerHTML = userCharacter.userName;
  document.getElementById("atkhp").innerHTML = userCharacter.currentHp;
  document.getElementById("atkstr").innerHTML = userCharacter.str;
  document.getElementById("atkdef").innerHTML = userCharacter.def;
  document.getElementById("defname").innerHTML = oppoent.userName;
  document.getElementById("defhp").innerHTML = oppoent.currentHp;
  document.getElementById("defstr").innerHTML = oppoent.str;
  document.getElementById("defdef").innerHTML = oppoent.def;
  //console.log("Stats updated");
}

async function findMatch(userId) {
  const matchMaking = await fetch("/findGame",
  {
      method:"POST",
      headers:{            
          "Content-Type": "application/json",
      },
      body:JSON.stringify({
          username: userId,
      }),
  });
  if(matchMaking.status === 200)
  {
      const message = await matchMaking.json();
      console.log(message.success);
      
  }
  if(matchMaking.status === 400)
  {
      const errorMessage = await matchMaking.json();
      console.log(errorMessage.error);
  }
}

async function loadData() 
{
  const gamePromise = await fetch(`/getGameDetails/${user}`,
  {
    method:"GET",
    headers:
    {
      "Content-Type":"application/json",
    },
  });

  if(gamePromise.status === 400)
  {
    alert("user is not in game, bug happened");
  }
  if(gamePromise.status === 200)
  {
    const game = await gamePromise.json(); 
    //console.log("game json");
    //console.log(game);

    gameId = game.id;
    gameDetails = game;
    //console.log(gameId);

    if(game.players.length == 2)
    {
      if(user == game.players[0].userName) //user = p1, oppoent = p2
      {
        //console.log("player 1");
        userCharacter = game.players[0];
        oppoent = game.players[1]; //oppenent is p2, user is p1
        p1 = game.players[0].userName; //just so we know who player 1 at all times
        if(game.player1Turn == true)
        {
          isYourturn = true;
        }
        else
        {
          isYourturn = false;
        }
      }
      if(user == game.players[1].userName) //user = p2, oppoent = p1
      {
        //console.log("player 2");
        userCharacter = game.players[1];
        oppoent = game.players[0];
        p1 = game.players[0].userName; //just so we know who player 1 is at all times. not really that nessicary, but it makes keeping track of things easier for me
        //console.log("oppoent" + oppoent);
        //console.log("p1 = " + p1);

        if(game.player1Turn == true)
        {
          isYourturn = false; 
        }
        else
        {
          isYourturn = true;
        }

      }
    }
    else
    {
      p1 = user;
    }
  }

  updateStats();
}
setInterval(loadData,200);  //uncomment this in a bit



async function handleAttack() //shouldn't need to have any pramas
{
  console.log(`${userCharacter.userName} is attacking ${oppoent.userName}`)
  //console.log("user = " + userCharacter.userName);
  //console.log("oppoent = " + oppoent.userName);

  damage = userCharacter.str - oppoent.def;
  //console.log("user str = " + userCharacter.str +"oppoent's def " +oppoent.def+ "\n thus damage = " + damage);
  let remaining = oppoent.currentHp - damage;
  log(`${userCharacter.userName} dealt ${damage} damage to ${oppoent.userName}`)

  const updateHp = await fetch("/changeCurrentHp",
  {  
    method:"POST" ,
    headers: 
    {
      "Content-Type":"application/json",
    },
    body:JSON.stringify
    ({
      username: oppoent.userName,
      hp: remaining,
    })
  });

  const endYourTurn = await fetch("/endTurn",
  {
    method:"POST",
    headers:
    {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
    {
      playerId: user,
      gameId: gameId,
    }),
  });


  //we now update the match to change the turn

  //last thing that needs to be done is to check whos turn it is, and to only allow players to attack on their turn
}


const myButton = document.getElementById("attackBtn");
myButton.addEventListener("click", async () => {  
    //await loadData();
    if(isYourturn)
    {
      console.log("is you turn");
      await handleAttack();
      //await loadData();
    }
    else
    {
      alert("is not your turn");
    }
  });

  const surrender = document.getElementById("surrenderBtn");
  surrender.addEventListener("click", async () => {
    log("surrender")
    const abruptEnd = await fetch("/abruptGameEnd", 
    {
        method:"POST",
        headers:
        {
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            id:3 //this needs to be dynamically changing to be the match that the players are on
        })
    });
    
    if(abruptEnd.status === 200) //the only thing i changed her to make this work. is that in the api route, i changed it so that the response data where i put res.status.json all in the same line as the return statement
    {
        //this happens when the api route goes through sucessfully, but since this happens when a match ends unexpectly its still consisdered an error 
        //alert("test");
        //console.log("come here");
        log("Match Surrendered")
        const errorMessage = await abruptEnd.json();
        console.log(errorMessage.error);
    }
    if(abruptEnd.status === 400)
    {
        const errorMessage = await abruptEnd.json()
        console.log(errorMessage.error);
    }
  });
  // Function to display console messages on the HTML page
function log(message) {
  var consoleDiv = document.getElementById("console");
  consoleDiv.innerHTML += message + "<br>";
  consoleDiv.style.opacity = 1;

  setTimeout(function() {
    consoleDiv.style.opacity = 0;
    consoleDiv.innerHTML = "";
  }, 4000);
}

/*
async function changeTurn(player1Data) {
const matchMaking = await fetch("/endTurn",
  {
      method:"POST",
      headers:{            
          "Content-Type": "application/json",
      },
      body:JSON.stringify({
          id: "test1",
      }),
  });
}



player1 = await fetch(`/getData/${name}`,
  {
    method:'GET',
    headers:{
      "Content-Type": "application/json",
    },
  });
  if (playerStats1.status == 200) {
    player1Data = await player1.json();
    console.log(player1Data)
  let gameId = player1Data.matchId
  let playersInMatch = await fetch(`/getMatchInfo/${gameId}`,
  {
    method:'GET',
    headers:
    {
      "Content-Type":"application/json",
    },
  });
  console.log("BIG TIME")
  console.log(playersInMatch);
  }
*/