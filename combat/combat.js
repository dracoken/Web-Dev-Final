import prisma from "../lib/prisma"
async function main() {
    const character = await prisma.Character.findUnique({ 
        where: 
        { 
                id: //user entered id
        } 
    })
    const currentHealth = character.hp
    const strength = character.str
    
}


