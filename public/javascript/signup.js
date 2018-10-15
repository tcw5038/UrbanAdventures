'use strict';
/* global $ */

function handleUserSignup(){
  $('form').on('click', '.signupbutton', function(event){//change button
    event.preventDefault();
    console.log("We are getting here!");
    createUserObject();//once the submit button has been clicked, create the user object
  });
}

function createUserObject(){
  let firstName = $("#firstName").val();
  let lastName = $("#lastName").val();
  let email = $("#email").val();
  let password = $("#password").val();

  console.log(firstName);

  let user = {//creates the object using the values obtained in the fields above
    firstName:firstName,
    lastName:lastName,
    email:email,
    username:email,
    password:password
  }
  console.log(user);//checking to make sure that everything worked so far

  createUser(user);//post request to create the new user
}

function createUser(user){

  let settings = {
    method: 'POST',
    data:JSON.stringify(user),
    headers: {//if i put this in i get 500 if i take this out i get 422
      'content-type': 'application/json',
    },
  }
  //ajax put request
  $.ajax(Object.assign({}, settings, {url: `/api/users/`}))
  .done(() => {
    console.log(`User with the email address: ${user.email} added to database`);
    $.ajax(Object.assign({}, settings, {url: `/api/auth/login`}))
    .done((res) => {
      console.log("User successfully logged in", res);
      localStorage.setItem('authToken', res.authToken);
      localStorage.setItem('username', email);
      window.location.href = "cities.html";
    })
    .fail(function(err){
      console.error(err);
      //put login errors here and generate the html either here or somewhere else
    })
  })

  .fail(function(err){
    console.error(err);
    //put login errors here and generate the html either here or somewhere else
  })
}

$(function () {
  handleUserSignup();

});
