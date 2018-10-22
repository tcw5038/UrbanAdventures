'use strict';
/* global $ */


function checkToken(){
  var token = localStorage.getItem('authToken');
  if(state.token){
    window.location.href = "cities.html";
  }
}



function handleLoginClicked(){//takes values for username/password when the user clicks to login and then calls logInUser
  $('form').on('submit', function(event){//listens for the user to click sign in
    event.preventDefault();
    let username = $("#email").val();
    let password = $("#password").val();
    logInUser(username, password);
  });
}

function handleDemoClicked(){//
  $('.demo-account-button').on('click', function(event){//listens for the user to click the demo account button
    event.preventDefault();
    let username = "livedemoaccount@gmail.com";
    let password = "mydemopassword";
    logInUser(username, password);
  });
}

function logInUser(username, password){//makes ajax request to get the user's information and then takes them to their dashboard
$.ajax({
  url:'/api/auth/login/',
  method: 'POST',
  headers: {
    'content-type':'application/json'
  },
  data: JSON.stringify({username, password
  })
}).then((res) => {
  localStorage.setItem('authToken', res.authToken);
  window.location.href = "cities.html";
})
.fail(error => {
  generateHTMLError();
})
}

function generateHTMLError(){
  $('.error-message').html("We couldn't find a user with that email/password combination. Please try again or sign up for a new account.");
}

$(function () {
  checkToken()
  handleLoginClicked();
  handleDemoClicked();
});
