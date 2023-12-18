const apiUser = "http://localhost:3000/user";
const username = document.querySelector(".input-signup-username");
const password = document.querySelector(".input-signup-password");
const namee = document.querySelector(".input-login-name");
const phone = document.querySelector(".input-login-phone");
const bntSignup = document.querySelector(".signup__signInButton");

bntSignup.addEventListener("click", (e) => {
    e.preventDefault();

    if (
        username.value === "" ||
        password.value === "" ||
        namee.value === "" ||
        phone.value === ""
    ) {
        alert("Please enter all required fields");
    } else if (password.value.length < 6) {
        alert("Password must be at least 6 characters long");
    } else if (!username.value.includes("@")) {
        alert("Username must be a valid email address");
    } else {
        const user = {
            namee: namee.value,
            phone: phone.value,
            username: username.value,
            password: password.value,
        };

        fetch(apiUser, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                // Assuming the server responds with a success message
                alert("Sign up successfully");
                window.location.href = "login.html";
            })
            .catch((error) => {
                alert("Error during sign up: " + error.message);
                console.error("Error during sign up:", error);
            });
    }
});