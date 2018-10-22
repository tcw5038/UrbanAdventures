'use strict';

function checkToken(){
  let token = localStorage.getItem('authToken');
  if(token){
    window.location.href = "cities.html";
  }
}

checkToken();
