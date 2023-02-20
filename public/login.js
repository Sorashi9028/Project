var jwt = localStorage.getItem("jwt");
if (jwt != null) {
  window.location.href = '/index'
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://fakestoreapi.com/users");
  // xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText)[0];
      console.log(objects);
      if (objects['password'] == 'm38rmF$') {
        localStorage.setItem("jwt", objects['phone']);
        Swal.fire({
          text: objects['username'],
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '../index';
          }
        });
      } else {
        Swal.fire({
          text: objects['username'],
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  return false;
}
