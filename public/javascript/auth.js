function checkToken(){
  var token = localStorage.getItem('authToken');
  if(state.token){
    window.location.href = "cities.html";
  }
}

checkToken()
