'use strict';
/* global $ */

function handleLoginClicked(){//takes values for email/password when the user clicks to login and then calls logInUser
    $('form').on('submit', function(event){//listens for the user to click sign in
        event.preventDefault();
        let email = $("#email").val();
        let password = $("#password").val();
        logInUser(email, password);
     });
}

function handleDemoClicked(){//
    $('.demo-account-button').on('click', function(event){//listens for the user to click the demo account button
        event.preventDefault();
        let email = "demoaccount@gmail.com";
        let password = "mydemopassword";
        logInUser(email, password);
     });
}

function logInUser(email, password){//makes ajax request to get the user's information and then takes them to their dashboard
    $.ajax({
        url:'/api/auth/login/',
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        data: JSON.stringify({email, password
        })
    }).then((res) => {
        localStorage.setItem('authToken', res.authToken);
        localStorage.setItem('email', email);
        window.location.href = "cities.html";
      })
      .fail(error => {
        generateHTMLError();
      })
}

function generateHTMLError(){
    $('.error-message').html("That email address is already in use. Please enter a different email address.");
}

$(function () {
    handleLoginClicked();
    handleDemoClicked();
    });