'use strict';
/* global $ */


function handleUserSignup(){//handles new user submissions and then calls the createUserObject function to store the data in each form field
  $('#signup-form').on('submit', function(event){
    event.preventDefault();
    createUserObject();
  });
}

function handleDemoClicked(){//
  $('.demo-account-button').on('click', function(event){//listens for the user to click the demo account button
      event.preventDefault();
      let username = 'livedemoaccount@gmail.com';
      let password = 'mydemopassword';
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
        localStorage.setItem('username', username);
        window.location.href = 'cities.html';
      })
      .fail(error => {
        generateHTMLError();
      })
}

function createUserObject(){//creates a user object using the form information from handleUserSignup
  let firstName = $('#firstName').val();
  let lastName = $('#lastName').val();
  let email = $('#email').val();
  let password = $('#password').val();

  let user = {
    firstName:firstName,
    lastName:lastName,
    email:email,
    username:email,
    password:password
  }
  createUser(user);//post request to create the new user
}

function createUser(user){//ajax requests to create a new user and then send them to their dashboard
  let settings = {
    method: 'POST',
    data:JSON.stringify(user),
    headers: {
      'content-type': 'application/json',
    },
  }
  $.ajax(Object.assign({}, settings, {url: `/api/users/`}))
  .done(() => {
    $.ajax(Object.assign({}, settings, {url: `/api/auth/login`}))
    .done((res) => {
      localStorage.setItem('authToken', res.authToken);
      localStorage.setItem('username', email);
      window.location.href = 'cities.html';
    })
    .fail(function(err){
      generateHTMLError();
    })
  })
  .fail(function(err){
    generateHTMLError();
  })
}

function generateHTMLError(){
  $('.error-message').html('That email address may be already in use. Please sign up with a different email address.');
}

$(function () {
  handleUserSignup();
  handleDemoClicked()
});
