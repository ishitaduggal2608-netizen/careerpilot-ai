import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [profile, setProfile] = useState(null);

  // ===============================
  // GET PROFILE FROM MONGODB
  // ===============================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message);

          // Token expired or invalid
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            window.location.href = "/login";
          }

          return;
        }

        setProfile(data.profile);

      } catch (error) {
        console.error("Dashboard profile error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      }
    };

    fetchProfile();
  }, []);


  // ===============================
  // GET LOGGED-IN USER
  // ===============================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "/login";
  };


  // ===============================
  // NAVIGATION
  // ===============================

  const handleRoadmap = () => {
    window.location.href = "/roadmap";
  };

  const handleDSA = () => {
    window.location.href = "/dsa";
  };

  const handleInterview = () => {
    window.location.href = "/interview";
  };

  const handleProfile = () => {
    window.location.href = "/profile";
  };

  const handleResume = () => {
    window.location.href = "/resume";
  };

  const handleAIAssistant = () => {
    window.location.href = "/ai-assistant";
  };


  // ===============================
  // DASHBOARD
  // ===============================

  return (
    <div className="dashboard">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="dashboard-header">

        <div>

          <p className="welcome">
            Welcome back, {profile?.name || user?.name || "there"} 👋
          </p>

          <h1>
            Your Placement Dashboard
          </h1>

          <p className="subtitle">
            Here's your placement preparation overview.
          </p>

        </div>


        <div className="header-right">

          {/* Brand */}

          <div className="brand-logo">

            <span className="brand-icon">
              ✦
            </span>

            <span className="brand-name">
              CareerPilot AI
            </span>

          </div>


          {/* Roadmap */}

          <button
            className="roadmap-button"
            onClick={handleRoadmap}
          >
            Roadmap
          </button>


          {/* DSA */}

          <button
            className="dsa-button"
            onClick={handleDSA}
          >
            DSA
          </button>


          {/* Interview */}

          <button
            className="dsa-button"
            onClick={handleInterview}
          >
            Interview
          </button>


          {/* Profile */}

          <button
            className="dsa-button"
            onClick={handleProfile}
          >
            Profile
          </button>


          {/* Resume */}

          <button
            className="dsa-button"
            onClick={handleResume}
          >
            Resume
          </button>


          {/* AI Assistant */}

          <button
            className="ai-button"
            onClick={handleAIAssistant}
          >
            ✦ AI Assistant
          </button>


          {/* Logout */}

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      {/* ===============================
          PLACEMENT READINESS
      =============================== */}

      <div className="readiness-card">

        <div className="card-top">

          <div>

            <p>
              Placement Readiness
            </p>

            <h2>
              72%
            </h2>

          </div>

          <span>
            📊
          </span>

        </div>


        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{ width: "72%" }}
          ></div>

        </div>

      </div>


      {/* ===============================
          STATISTICS
      =============================== */}

      <div className="stats-grid">


        {/* DSA */}

        <div className="stat-card">

          <span>
            💻
          </span>

          <p>
            DSA Progress
          </p>

          <h2>
            68%
          </h2>

          <small>
            Keep solving problems consistently.
          </small>

        </div>


        {/* Interview */}

        <div className="stat-card">

          <span>
            🤖
          </span>

          <p>
            Interview Preparation
          </p>

          <h2>
            54%
          </h2>

          <small>
            Practice technical and HR interviews.
          </small>

        </div>


        {/* Career Goal */}

        <div className="stat-card">

          <span>
            🎯
          </span>

          <p>
            Career Goal
          </p>

          <h2>
            {profile?.careerGoal || "Not Set"}
          </h2>

          <small>
            Stay focused on your target role.
          </small>

        </div>

      </div>


      {/* ===============================
          TODAY'S FOCUS
      =============================== */}

      <div className="focus-section">

        <h2>
          Today's Focus
        </h2>


        {/* DSA Focus */}

        <div className="focus-item">

          <span>
            ✓
          </span>

          <div>

            <h3>
              Complete 2 DSA problems
            </h3>

            <p>
              Keep your placement roadmap on track.
            </p>

          </div>

        </div>


        {/* Interview Focus */}

        <div className="focus-item">

          <span>
            ✓
          </span>

          <div>

            <h3>
              Practice interview questions
            </h3>

            <p>
              Prepare answers for common technical questions.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;