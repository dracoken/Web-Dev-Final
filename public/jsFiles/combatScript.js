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

let player1Data,player2Data
let player1, player2
async function updateStats(player1Data, player2Data) {
  console.log("updating player stats")
  document.getElementById("atkname").innerHTML = player1Data.playerData.userName;
  document.getElementById("atkhp").innerHTML = player1Data.playerData.currentHp;
  document.getElementById("atkstr").innerHTML = player1Data.playerData.str;
  document.getElementById("atkdef").innerHTML = player1Data.playerData.def;
  document.getElementById("defname").innerHTML = player2Data.playerData.userName;
  document.getElementById("defhp").innerHTML = player2Data.playerData.currentHp;
  document.getElementById("defstr").innerHTML = player2Data.playerData.str;
  document.getElementById("defdef").innerHTML = player2Data.playerData.def;
  console.log("Stats updated");
}

window.onload = async function(player1,player2) {
  const playerStats1 = await fetch("/getCurrentHp/test1", 
  {
    method: "GET",
    headers:
    {
      "Content-Type":"application/json",
    },
  });

    if (playerStats1.status == 200) {
      player1 = await playerStats1.json();
      console.log(player1)
    }
    if(this.status === 400)
    {
        const errorMessage = await playerStats1.json();
        console.log(errorMessage.error);
    }
    
  const playerStats2 = await fetch("/getCurrentHp/test2", 
  {
    method: "GET",
    headers:
    {
      "Content-Type":"application/json",
    },
  });

    if (playerStats2.status == 200) {
      player2 = await playerStats2.json();
      console.log(player2)
    }
    if(playerStats2.status === 400)
    {
        const errorMessage = await playerStats2.json();
        console.log(errorMessage.error);
    }
    

    updateStats(player1, player2)
  };




async function handleAttack(player1Data, player2Data) {
  console.log(`${player1Data.playerData.userName} is attacking ${player2Data.playerData.userName}`)
  //console.log(player1Data.playerData.str)
  damage = player1Data.playerData.str - player2Data.playerData.def
  let remaining = player2Data.playerData.currentHp - damage
  log(`${player1Data.playerData.userName} dealt ${damage} damage to ${player2Data.playerData.userName}`)

  const updateHp = await fetch("/changeCurrentHp",
  {  
    method:"POST" ,
    headers: 
    {
      "Content-Type":"application/json",
    },
    body:JSON.stringify
    ({
      username: "test2",
      hp: remaining,
    })

  })
}


const myButton = document.getElementById("attackBtn");
myButton.addEventListener("click", async () => {  
   
  const grabingCurrentHp = await fetch("/getCurrentHp/test1",
    {
        method: "GET",
        headers:
        {
          "Content-Type":"application/json",
        },
    });
    
    if(grabingCurrentHp.status === 200)
    {
        
        player1Data = await grabingCurrentHp.json();
        console.log(player1Data.playerData);
    }
    if(grabingCurrentHp.status === 400)
    {
        const errorMessage = await grabingCurrentHp.json();
        console.log(errorMessage.error);
    }
  
  grabingCurrentHpEnemy = await fetch("/getCurrentHp/test2",
    {
        method: "GET",
        headers:
        {
            "Content-Type":"application/json",
        },
    });
    
    if(grabingCurrentHpEnemy.status === 200)
    {
       player2Data = await grabingCurrentHpEnemy.json();
        console.log(player2Data.playerData);
    }
    if(grabingCurrentHpEnemy.status === 400)
    {
        const errMessage = await grabingCurrentHpEnemy.json();
        console.log(errMessage.error);
    }
    await handleAttack(player1Data, player2Data);
    await updateStats(player1Data,player2Data);

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
            id: 3 //this needs to be dynamically changing to be the match that the players are on
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


  
    