// register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      console.log("Attempting registration..."); // Debug log
      
      const response = await fetch("/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });
      
      console.log("Response status:", response.status); // Debug log
      
      // Get the raw text first
      const responseText = await response.text();
      console.log("Raw response:", responseText); // Debug log
      
      // Try to parse it as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response text:", responseText);
        throw new Error("Invalid server response");
      }
      
      console.log("Parsed response:", result); // Debug log

      if (result.status === "success") {
        alert("Registration successful! You can now log in.");
        window.location.href = "/login.html";
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + (error.message || "Unknown error occurred"));
    }
  });
