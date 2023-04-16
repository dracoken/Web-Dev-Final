//const express = require("express"); //this makes the code break

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

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

//can't figure out how to put a response to aleart if reg attempt is failure or sucessful.
// also We need to be able to prevent the default behaviour of the form on a failure
//so far the method dose in fact checks with the db, if the username has been taken already or not
async function register()
{
    //console.log("in register function");
    let registerUsername = regUsername.value;
    let registerPassword = regPassword.value;
    //console.log("username = " + testUsername);
    //console.log("password = "+ testPassword);
    //alert("testing"); //alerts work outside the promise, but not inside them? 

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
    }).then(res => {
        if(!res.ok)
        {
            //regForm.onsubmit = "return false";
            console.log("error");
            return res.json();

        }
    }).then((data) => {
        console.log(data.error);
    });
}





// loginButton.addEventListener("click", (event) => {

// });

//it still needs some UI changes to show that there has been an invaild login, however it talks to the server properly
//and also we have to stop the default behavior of the form, if we do see an invaild login occur
function login()
{
    console.log("in login function");
    const logAttemptUsername = loginUsername.value;
    const logAttemptPassword = loginPassword.value;
    /*
        //below is test code for match making
    const matchMaking = fetch("/findGame",
    {
        method:"POST",
        headers:{            
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            "username":logAttemptUsername,
        }),
    });
    */

    //below all works im just testing if my api route works
    const loginAttempt = fetch(`/login/${logAttemptUsername}/${logAttemptPassword}`);
    console.log(loginAttempt);
    if(loginAttempt.status == 400)
    {
        alert("invaild username or password");
    }

}
