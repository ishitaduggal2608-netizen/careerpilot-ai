import "./Login.css";

function Login() {
  const handleLogin = (event) => {
  event.preventDefault();

  localStorage.setItem("isLoggedIn", "true");

  window.location.href = "/dashboard";
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
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
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