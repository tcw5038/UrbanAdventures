'use strict';
/* global $ */

function handleLoginClicked(){//handles when the user clicks to login
    $('form').on('click', '.signinbutton', function(event){//listens for the user to click sign in
        event.preventDefault();
        let email = $("#email").val();
        let password = $("#password").val();
     });
    logInUser(loginInfo);
}

function logInUser(loginInfo){//makes ajax call to get the users information
    $.ajax({



    })
}


$(function () {
    handleLoginClicked();
    
    });
