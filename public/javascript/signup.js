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
  console.log(user);
    //ajax put request
      $.ajax({
        url: `/api/users/`,
        method: 'POST',
        dataType:'json',
        data:JSON.stringify(user),
        /*headers: {//if i put this in i get 500 if i take this out i get 422
          'Content-Type': 'application/json',
        },*/
      })
      .done(function(response){
        console.log(`${user.firstName} added to database`)
        console.log(response);
        //should call the sign in function
        //save token to local storage so that it will still be there even if we refresh the page
        //generate their cities
        //take them to the dashboard
        //make sure to add a message saying that there are no cities
      })
      .fail(function(err){
        console.error(err);
        //put login errors here and generate the html either here or somewhere else
      })
    }

    $(function () {
      handleUserSignup();
      
      });

    