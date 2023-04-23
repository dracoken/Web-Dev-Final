//const express = require("express"); //this makes the code break

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');


const logForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const logRemberLogin = document.getElementById("rememberLogin");
const loginButton = document.getElementById("loginBtn");

const regForm = document.getElementById("regForm");
const regUsername = document.getElementById("registerUsername"); //register username
const regPassword = document.getElementById("registerPassword");
const agreeToConditions = document.getElementById("agreeToConditions"); //is a check box
//const regButton = document.getElementById("registerBtn");

//let regBtn = document.querySelector("#registerBtn"); //register button



/*
//we can choose to make this an onload function or keep it the way how i did it
window.onload = function()
{
    let regBtn = document.querySelector("#registerBtn");
    console.log(regBtn);
    regBtn.onclick = () => {
        console.log("in here");
    };
}
*/

//console.log("script is loaded"); //checks to see if the script file has been loaded in properly. it will print out on the client side automatically if it was loaded correctly

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
    wrapper.classList.remove('active');
});

// also We need to be able to prevent the default behaviour of the form on a failure
//so far the method dose in fact checks with the db, if the username has been taken already or not
async function register()
{
    //console.log("in register function");
    let registerUsername = regUsername.value;
    let registerPassword = regPassword.value;
    //console.log("username = " + testUsername);
    //console.log("password = "+ testPassword);

    //still needs to prevent on submit form behavior on bad input, but i got the response for both done
    const registerAttempt = await fetch("/register",
    {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            "username":registerUsername,
            "password":registerPassword,

        }),
    });
    if(registerAttempt.status === 200)
    {
        const message = await registerAttempt.json();
        alert("Sign up was successful, please now sign in");
        console.log(message.success);
    }
    if(registerAttempt.status === 400)
    {
        const errorMessage = await registerAttempt.json();
        console.log(errorMessage.error);
        alert("User name is taken");
    }
}





//and also we have to stop the default behavior of the form, if we do see an invaild login occur
async function login(ev)
{
    //ev.preventDefault(); //uncomment this line during presentation to show that the login works properly
    console.log("in login function");
    const logAttemptUsername = loginUsername.value;
    const logAttemptPassword = loginPassword.value;
    localStorage.setItem('username', logAttemptUsername);  //uncommnet this line during presentation to show that our page website dose infact do login verfication, just that the form dosen't care and moves on before the page dose the verification 
    //findMatch(logAttemptUsername); //comment this line during presentation when showing login verification

    //test code for when the game is ended abruptly. ie if a player exits the website mid match
    /*
    const abruptEnd = await fetch("/abruptGameEnd", 
    {
        method:"POST",
        headers:
        {
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            id:2
        })
    });
    
    if(abruptEnd.status === 200) //the only thing i changed her to make this work. is that in the api route, i changed it so that the response data where i put res.status.json all in the same line as the return statement
    {
        //this happens when the api route goes through sucessfully, but since this happens when a match ends unexpectly its still consisdered an error 
        //alert("test");
        //console.log("come here");
        const errorMessage = await abruptEnd.json();
        console.log(errorMessage.error);
    }
    if(abruptEnd.status === 400)
    {
        const errorMessage = await abruptEnd.json()
        console.log(errorMessage.error);
    }
    */

    /*
    //test code for getting the player's current hp. it currently just returns the entire user info. i can later change it to return just the current hp
    const grabingCurrentHp = await fetch(`/getCurrentHp/${logAttemptUsername}`,
    {
        method: "GET",
        headers:
        {
            "Content-Type":"application/json",
        },
    });
    
    if(grabingCurrentHp.status === 200)
    {
        const message = await grabingCurrentHp.json();
        console.log(message.hp);
    }
    if(grabingCurrentHp.status === 400)
    {
        const errorMessage = await grabingCurrentHp.json();
        console.log(errorMessage.error);
    }
    */

    /*
    //test code for using the api route that changes the hp of the players
    const changeHp = await fetch("/changeCurrentHp",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            "username":logAttemptUsername, //username of the player whos hp you trying to change
            "hp":20, //some value that calculated to represent the actually hp
        }),
    });

    if(changeHp.status === 200)
    {
        const message = await changeHp.json();
        console.log(message.success);
    }
    if(changeHp.status === 400)
    {
        const errorMessage = await changeHp.json();
        console.log(errorMessage.error);
    }
    */
    
    /*
        //below is test code for match making
    const matchMaking = await fetch("/findGame",
    {
        method:"POST",
        headers:{            
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            "username":logAttemptUsername,
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
    */

    //below all works im just testing if my api route works
    const loginAttempt = await fetch(`/login/${logAttemptUsername}/${logAttemptPassword}`);
    if(loginAttempt.status === 400)
    {   
        ev.preventDefault();
        const errorMessage = await loginAttempt.json();
        console.log(errorMessage.error);
        alert("invaild username or password");
    }
    if(loginAttempt.status === 200)
    {
        const message = await loginAttempt.json();
        //console.log(message);
        console.log(message.success);
        localStorage.setItem('username', message.playerId); //sets the local storage with the id of the loged in user
        //const storeUsername = localStorage.getItem('username');  
        //console.log(storeUsername);
        //findMatch(message.player.id);
    }
}

async function findMatch(userId) {
    const matchMaking = await fetch(`/findGame/${userId}`,
    {
        method:"POST",
        headers:{            
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            "username":logAttemptUsername,
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

