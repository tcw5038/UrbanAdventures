'use strict';
/* global $ */

function handleLoginClicked(){//handles when the user clicks to login
    $('form').on('click', '.signinbutton', function(event){//listens for the user to click sign in
        event.preventDefault();
        let email = $("#email").val();
        let password = $("#password").val();
     });
     console.log(loginInfo);
    logInUser(loginInfo);
}

function logInUser(loginInfo){//makes ajax call to get the users information
    $.ajax({
        url:'/api/auth/login',//go back and check to make sure this is right
        method: 'POST',
        data:JSON.stringify(loginInfo),
        headers: {
            'content-type':'application/json'
        }
        
        


    })
}


$(function () {
    handleLoginClicked();
    
    });
