'use strict';
/* global $ */

function handleUserSignup(){//handles new user submissions and then calls the createUserObject function to store the data in each form field
  $('form').on('click', '.signupbutton', function(event){
    event.preventDefault();
    createUserObject();
  });
}

function createUserObject(){//creates a user object using the form information from handleUserSignup
  let firstName = $("#firstName").val();
  let lastName = $("#lastName").val();
  let email = $("#email").val();
  let password = $("#password").val();

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
      window.location.href = "cities.html";
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
  $('.error-message').html("Please insert a valid email and password combination!");
}

$(function () {
  handleUserSignup();
});
