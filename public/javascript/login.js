'use strict';
/* global $ */

function handleLoginClicked(){//handles when the user clicks to login
    $('form').on('submit', function(event){//listens for the user to click sign in
        event.preventDefault();
        let username = $("#email").val();
        let password = $("#password").val();

        console.log(username , password);
        logInUser(username, password);

     });
}

function logInUser(username, password){//makes ajax call to get the users information
    $.ajax({
        url:'/api/auth/login/',//go back and check to make sure this is right
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        data: JSON.stringify({username, password
        })
    }).then((res) => {
        console.log("User successfully logged in");
        localStorage.setItem('authToken', res.authToken);
        localStorage.setItem('username', username);
        window.location.href = "cities.html";
      })
      .fail(error => {
        //insert error message in a div that tells the user to insert a valid username
        console.log("Please insert a valid username and password combination!");
        console.error(error);
      })
}


$(function () {
    handleLoginClicked();
    });