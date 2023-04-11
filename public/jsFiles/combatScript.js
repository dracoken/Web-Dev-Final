const attack = document.querySelector('#attack');
const surrender = document.querySelector('#surrender');
const leftPlayer = document.querySelector('left-player');
const rightPlayer = document.querySelector('right-player');
const rightPic = document.querySelector('#rightCharImg');
let leftPic = document.querySelector("#leftCharImg");

async function attack(id) {
    
    const player = await prisma.Character.findUnique({
      where: { id },
    });
    const str = prisma.Character.findUnique({
        where: {str}
    })
    const def = prisma.Character.findUnique({
        where: {def}
    })
  
    const updatedObject = await prisma.Character.update({
      where: { id },
      data: { currentHp: currentHp - (str - def) },
    });
  
    return updatedObject;
  }
  async function surrender() {

  }
  