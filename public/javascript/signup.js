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
        url: `/api/users/`,
        method: 'POST',
        data: user//JSON.stringify(user),
        /*headers: {
          'Content-Type': 'application/json',
        },*/
      })
      .done(function(response){
        console.log(`${user} added to database`)
        console.log(response);
        //send the user back to the home page? should they be signed in or not?
      })
      .fail(function(err){
        console.error(err);
        //put login errors here and generate the html either here or somewhere else
      })
    }

    $(function () {
      handleUserSignup();
      
      });