const token =
new URLSearchParams(
window.location.search
).get("token");

document
.getElementById("resetBtn")
.addEventListener(
"click",
async()=>{

const password =
document
.getElementById("password")
.value;

const confirmPassword =
document
.getElementById("confirmPassword")
.value;

if(password===""){

alert("Password belum diisi");

return;

}

if(password.length<8){

alert(
"Password minimal 8 karakter"
);

return;

}

if(password!==confirmPassword){

alert(
"Konfirmasi password tidak sama"
);

return;

}

try{

const response =
await fetch(

"http://localhost:5000/api/reset-password",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:JSON.stringify({

token,
password

})

}

);

const result =
await response.json();

alert(result.message);

window.location.href=
"login.html";

}catch(error){

alert(
"Gagal reset password"
);

console.log(error);

}

});