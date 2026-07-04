// =========================
// SLIDER LOGIN & SIGNUP
// =========================

const loginText = document.querySelector(".title-text .login");
const loginFormSlider = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector(".signup-link a");

signupBtn.onclick = () => {
    loginFormSlider.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
};

loginBtn.onclick = () => {
    loginFormSlider.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
};

signupLink.onclick = () => {
    signupBtn.click();
    return false;
};

// =========================
// LOGIN
// =========================

document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.user.role
        );

        localStorage.setItem(
            "userId",
            data.user.id
        );

        localStorage.setItem(
            "name",
            data.user.name
        );

        // Redirect sesuai role

        if (data.user.role === "admin") {

            window.location.href =
                "dashboard_admin.html";

        } else {

            window.location.href =
                "dashboard_customer.html";

        }

    } catch (error) {

        console.error(error);

        alert("Server tidak dapat dihubungi");

    }

});

// =========================
// REGISTER
// =========================

document
.getElementById("signupForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById(
            "registerConfirmPassword"
        ).value;

    if(password.length < 8){

        alert("Password minimal 8 karakter");

        return;
    }

    if(password !== confirmPassword){

        alert("Konfirmasi password tidak cocok");

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if(!response.ok){

            alert(data.message);

            return;
        }

        alert("Registrasi berhasil, silakan login");

        loginBtn.click();

        document
            .getElementById("signupForm")
            .reset();

    } catch(error){

        console.error(error);

        alert("Server tidak dapat dihubungi");

    }

});