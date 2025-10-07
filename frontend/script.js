const API_URL = "http://localhost:5000/api/auth";

// Handle Login with auto-signup if email not registered
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      let res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();

      if (res.ok) {
        // ✅ Login success
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else if (data.message.includes("User not found")) {
        // ❌ Email not registered → Auto signup
        alert("User not found. Registering new account...");

        const name = email.split("@")[0]; // default username from email
        res = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          alert("Signup & login successful!");
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Signup failed.");
        }
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  });
}

// Signup (manual signup page)
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Signup successful!");
        window.location.href = "dashboard.html";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}
