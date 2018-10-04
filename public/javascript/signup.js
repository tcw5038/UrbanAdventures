'use strict';
/* global $ */

function handleUserSignup(){
$('.signupbutton').on('submit', function(event){
    //should likely have some error handling in here or in createUserObject as well
    createUserObject();//once the submit button has been clicked, create the user object
 });
}

function createUserObject(){

    let firstName = $("#firstName").val;
    let lastName = $("#lastName").val;
    let email = $("#email").val;
    let password = $("#password").val;

    let newUser = {//creates the object using the values obtained in the fields above
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password
    }
    console.log(newUser);//checking to make sure that everything worked so far

    createUser(newUser);//post request to create the new user
}

function createUser(user){
    //ajax put request
      $.ajax({
        type: 'POST',
        url: `/api/users`,
        data: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .done(function(response){
        //send the user back to the home page? should they be signed in or not?
      })
      .fail(function(err){
        //put login errors here and generate the html either here or somewhere else
      })
    }