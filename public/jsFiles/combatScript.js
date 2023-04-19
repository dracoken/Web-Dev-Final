const { prisma } = require('../../server')
const attack = document.querySelector('#attack');
const surrender = document.querySelector('#surrender');
const leftPlayer = document.querySelector('left-player');
const rightPlayer = document.querySelector('right-player');
const rightPic = document.querySelector('#rightCharImg');
let leftPic = document.querySelector("#leftCharImg");


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
  /*
  // Import the Prisma client
const { PrismaClient } = require('@prisma/client')

// Create a new instance of the client
const prisma = new PrismaClient()

// Define a function to update the character's HP based on strength and defence
async function updateHp(characterId) {
  // Get the character data from the database
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: { health: true, defence: true, strength: true, hp: true },
  })

  // Calculate the new HP based on the difference between strength and defence
  const hpDifference = character.strength - character.defence
  const newHp = character.hp - hpDifference

  // Update the character's HP in the database
  const updatedCharacter = await prisma.character.update({
    where: { id: characterId },
    data: { hp: newHp },
  })

  // Return the updated character data
  return updatedCharacter
}

// Call the updateHp function with a character ID to update the character's HP
updateHp(1)
  .then((updatedCharacter) => console.log(updatedCharacter))
  .catch((error) => console.error(error))
*/