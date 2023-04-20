console.log("inside CombatScript")
/*
const attack = document.querySelector('#attack');
const surrender = document.querySelector('#surrender');
const leftPlayer = document.querySelector('left-player');
const rightPlayer = document.querySelector('right-player');
const rightPic = document.querySelector('#rightCharImg');
let leftPic = document.querySelector("#leftCharImg");

const button = document.getElementById('attackBtn')

  button.addEventListener('click', async () => {
  try {
    const updatedCharacter = await handleAttack()
    console.log(updatedCharacter)
  } catch (error) {
    console.error(error)
  }
})
async function handleAttack() {
  const match = await prisma.match.findFirst({ where: { matchDone: false } })
  const [attacker, defender] = match.players

  const damage = calculateDamage(attacker.strength, defender.defense)
  const updatedHp = defender.hp - damage

  await prisma.user.update({
    where: { id: defender.id },
    data: { hp: updatedHp }
  })

  console.log(`Attacker ${attacker.name} dealt ${damage} damage to Defender ${defender.name}`)


  function calculateDamage(attackerStrength, defenderDefense) {
    const damage = attackerStrength - defenderDefense
    return Math.max(0, damage)
  }
  await prisma.match.update({
    where: { id: match.id },
    data: { player1Turn: !match.player1Turn },
  })
  if (newHealth === 0) {
    await prisma.match.update({
      where: { id: match.id },
      data: { matchDone: true },
    })
    console.log(`${defender.name} has been defeated!`)
  }
}
/*
async function attackChar(charID) {
    const player = await prisma.User.findUnique({
      where: { id: charID},
      select: { hp: true, def: true, str: true, currenHp: true },
    });
    let hpDifference = character.str - character.def
    if (hpDifference <= 0){
      hpDifference = 0;
    }

    const newHp = character.currentHp - hpDifference

    const updatedObject = await prisma.Character.update({
      where: { id : charID },
      data: { currentHp: newHp },
    });
  
    return updatedObject;
  }

  async function surrenderGame() {

  }
  const button = document.getElementById('attackBtn')
  button.addEventListener('click', async () => {
  try {
    const updatedCharacter = await attackChar(charID)
    console.log(updatedCharacter)
  } catch (error) {
    console.error(error)
  }
})
  // combat.js

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get the two players from the database
const player1 = await prisma.user.findUnique({ where: { id: 1 } })
const player2 = await prisma.user.findUnique({ where: { id: 2 } })

// Initialize the match with the two players
const match = await prisma.match.create({
  data: {
    players: { connect: [{ id: player1.id }, { id: player2.id }] },
    player1First: true,
    player1Turn: true,
    matchStarted: true,
    matchDone: false,
  },
})
*/

/*
// Function to handle an attack by one player on the other
const handleAttack = async () => {
  // Get the current health of the defender
  const { health } = await prisma.user.findUnique({ where: { id: defender.id } })

  // Calculate the damage based on the attacker's strength and the defender's defense
  const damage = Math.max(0, attacker.strength - defender.defense)

  // Calculate the new health of the defender after the attack
  const newHealth = Math.max(0, health - damage)

  // Update the defender's health in the database
  await prisma.user.update({
    where: { id: defender.id },
    data: { health: newHealth },
  })

  // Switch turns
  await prisma.match.update({
    where: { id: match.id },
    data: { player1Turn: !match.player1Turn },
  })

  // Check if the match is over
  if (newHealth === 0) {
    await prisma.match.update({
      where: { id: match.id },
      data: { matchDone: true },
    })
    console.log(`${defender.name} has been defeated!`)
  }
}

// Function to handle a turn in the match
const handleTurn = async () => {
  const attacker = match.player1Turn ? player1 : player2
  const defender = match.player1Turn ? player2 : player1

  console.log(`${attacker.name}'s turn!`)

  // Simulate the player selecting the "attack" button
  await handleAttack(attacker, defender)
}

// Start the match
while (!match.matchDone) {
  await handleTurn()
}

// combat.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function handleAttack() {
  const match = await prisma.match.findFirst({ where: { matchDone: false } })
  const [attacker, defender] = match.players

  const damage = calculateDamage(attacker.strength, defender.defense)
  const updatedHp = defender.hp - damage

  await prisma.user.update({
    where: { id: defender.id },
    data: { hp: updatedHp }
  })

  console.log(`Attacker ${attacker.name} dealt ${damage} damage to Defender ${defender.name}`)
}

function calculateDamage(attackerStrength, defenderDefense) {
  const damage = attackerStrength - defenderDefense
  return Math.max(0, damage)
}

async function main() {
  await handleAttack()
  // add code to display updated player stats and switch turns
}

main()
*/
function handleAttack(data, data2) {
  console.log(`attacking ${data.userName}`)
  damage = data.str - data2.def
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
        
        const data = await grabingCurrentHp.json();
        handleAttack(data);
        console.log(data.playerData);
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
        const data2 = await grabingCurrentHpEnemy.json();
        console.log(data2.playerData);
    }
    if(grabingCurrentHpEnemy.status === 400)
    {
        const errMessage = await grabingCurrentHpEnemy.json();
        console.log(errMessage.error);
    }
  });
  
    