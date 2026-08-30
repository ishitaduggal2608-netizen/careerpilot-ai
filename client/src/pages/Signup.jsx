import "./Signup.css";

function Signup() {
  const handleSignup = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    // Check passwords
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed!");
        return;
      }

      alert("Account created successfully!");

      window.location.href = "/login";
    } catch (error) {
      console.error("Signup error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <h1>Create Account 🌱</h1>

        <p>
          Create your account to start your career preparation.
        </p>

        <form onSubmit={handleSignup}>

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            required
          />

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
            placeholder="Create a password"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>

      </div>
    </div>
  );
}

export default Signup;