const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
let regBtn = document.querySelector("#registerBtn");

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

console.log("script is loaded");

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

function register()
{
    console.log("in register function");
}

function login()
{
    console.log("in login function");
}
