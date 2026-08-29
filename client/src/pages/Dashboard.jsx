import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="welcome">Welcome back 👋</p>
          <h1>Your Placement Dashboard</h1>
          <p className="subtitle">
            Here's your placement preparation overview.
          </p>
        </div>

        <div className="profile-circle">CP</div>
      </div>

      {/* Placement Readiness */}
      <div className="readiness-card">
        <div className="card-top">
          <div>
            <p>Placement Readiness</p>
            <h2>72%</h2>
          </div>

          <span>📊</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "72%" }}
          ></div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <span>💻</span>
          <p>DSA Progress</p>
          <h2>68%</h2>
          <small>Keep solving problems consistently.</small>
        </div>

        <div className="stat-card">
          <span>🤖</span>
          <p>Interview Preparation</p>
          <h2>54%</h2>
          <small>Practice technical and HR interviews.</small>
        </div>

        <div className="stat-card">
          <span>🎯</span>
          <p>Career Goal</p>
          <h2>Software Developer</h2>
          <small>Stay focused on your target role.</small>
        </div>

      </div>

      {/* Today's Focus */}
      <div className="focus-section">

        <h2>Today's Focus</h2>

        <div className="focus-item">
          <span>✓</span>

          <div>
            <h3>Complete 2 DSA problems</h3>
            <p>
              Keep your placement roadmap on track.
            </p>
          </div>
        </div>

        <div className="focus-item">
          <span>✓</span>

          <div>
            <h3>Practice interview questions</h3>
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