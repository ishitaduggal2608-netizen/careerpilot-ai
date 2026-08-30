import "./Login.css";

function Login() {
  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(data.user));

      // Keep login status
      localStorage.setItem("isLoggedIn", "true");

      alert("Login successful!");

      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Welcome Back 👋</h1>

        <p>
          Login to continue your career preparation.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => window.location.href = "/signup"}
          >
            Sign up
          </button>

        </p>

      </div>
    </div>
  );
}

export default Login;