document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const responseMessage = document.getElementById("responseMessage");

    try {
        console.log("Sending contact form data:", { name, email, message }); // Debugging log

        const response = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();
        console.log("Server Response:", result); // Debugging log

        if (response.ok) {
            responseMessage.style.color = "green";
            responseMessage.textContent = "Message sent successfully!";
            document.getElementById("contactForm").reset(); // Reset form
        } else {
            responseMessage.style.color = "red";
            responseMessage.textContent = result.error || "Failed to send message!";
        }
    } catch (error) {
        console.error("Error:", error);
        responseMessage.style.color = "red";
        responseMessage.textContent = "Something went wrong. Please try again!";
    }
});
