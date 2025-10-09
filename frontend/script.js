const API_URL = "http://localhost:5000/api/auth";

// Handle Login with auto-signup if email not registered
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      let res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Login successful!");
        window.location.href = "dashboard.html";
      } else if (data.message?.includes("User not found")) {
        alert("User not found. Registering new account...");
        const name = email.split("@")[0];
        res = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          alert("Signup & login successful!");
          window.location.href = "C:\Users\yashvi soni\OneDrive\Desktop\yashvi_code\web\project\dashboard.html";
        } else alert(data.message || "Signup failed.");
      } else alert(data.message || "Login failed.");
    } catch (err) {
      alert("Server error: " + err.message);
    }
  });
}

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

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
        window.location.href = "C:\Users\yashvi soni\OneDrive\Desktop\yashvi_code\web\project\dashboard.html";
      } else alert(data.message);
    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  });
}

// Forgot Password
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim();
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

// ---------------- Google Auth ----------------
const googleLoginBtn = document.getElementById("googleLogin");
const googleSignupBtn = document.getElementById("googleSignup");

async function handleGoogleAuth() {
  try {
    // Redirect user to Google OAuth route on backend
    window.location.href = `${API_URL}/google`;
  } catch (err) {
    alert("Google login failed: " + err.message);
  }
}

if (googleLoginBtn) googleLoginBtn.addEventListener("click", handleGoogleAuth);
if (googleSignupBtn) googleSignupBtn.addEventListener("click", handleGoogleAuth);
