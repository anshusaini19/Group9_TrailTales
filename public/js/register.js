document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("form");

    registerForm.addEventListener("submit", (event) => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const email = document.getElementById("email").value;

        if (!username || !password || !email) {
            event.preventDefault();
            alert("All fields are required!");
        }
    });
});
