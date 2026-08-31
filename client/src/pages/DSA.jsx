import { useEffect, useState } from "react";
import "./DSA.css";

function DSA() {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  const [leetcodeStats, setLeetcodeStats] = useState(null);

  // ===============================
  // DSA TOPICS
  // ===============================

  const [topics, setTopics] = useState([
    {
      id: 1,
      name: "Arrays",
      completed: false,
    },
    {
      id: 2,
      name: "Strings",
      completed: false,
    },
    {
      id: 3,
      name: "Linked Lists",
      completed: false,
    },
    {
      id: 4,
      name: "Stacks & Queues",
      completed: false,
    },
    {
      id: 5,
      name: "Trees",
      completed: false,
    },
    {
      id: 6,
      name: "Graphs",
      completed: false,
    },
  ]);

  // ===============================
  // GET SAVED LEETCODE USERNAME
  // ===============================

  useEffect(() => {
    const fetchLeetcodeUsername = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/leetcode",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (
            response.status === 401 ||
            response.status === 403
          ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            window.location.href = "/login";
            return;
          }

          console.error(data.message);
          return;
        }

        if (data.leetcodeUsername) {
          setLeetcodeUsername(data.leetcodeUsername);
          setConnected(true);

          // Fetch real statistics
          fetchLeetcodeStats();
        }
      } catch (error) {
        console.error(
          "LeetCode username fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeetcodeUsername();
  }, []);

  // ===============================
  // FETCH LEETCODE STATISTICS
  // ===============================

  const fetchLeetcodeStats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setStatsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/leetcode/stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setLeetcodeStats(data);
    } catch (error) {
      console.error(
        "LeetCode stats error:",
        error
      );
    } finally {
      setStatsLoading(false);
    }
  };

  // ===============================
  // CONNECT LEETCODE
  // ===============================

  const handleConnectLeetCode = async (event) => {
    event.preventDefault();

    if (!leetcodeUsername.trim()) {
      alert("Please enter your LeetCode username.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/leetcode",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            leetcodeUsername:
              leetcodeUsername.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");

          window.location.href = "/login";
        }

        return;
      }

      setLeetcodeUsername(
        data.leetcodeUsername
      );

      setConnected(true);

      // Fetch real LeetCode statistics
      await fetchLeetcodeStats();
    } catch (error) {
      console.error(
        "Connect LeetCode error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  // ===============================
  // DISCONNECT LEETCODE
  // ===============================

  const handleDisconnect = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/leetcode",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setConnected(false);
      setLeetcodeUsername("");
      setLeetcodeStats(null);
    } catch (error) {
      console.error(
        "Disconnect LeetCode error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // ===============================
  // TOPIC COMPLETION
  // ===============================

  const toggleTopic = (id) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              completed: !topic.completed,
            }
          : topic
      )
    );
  };

  // ===============================
  // COMPLETED TOPICS
  // ===============================

  const completedTopics = topics.filter(
    (topic) => topic.completed
  ).length;

  // ===============================
  // TOPIC PROGRESS
  // ===============================

  const topicProgress = Math.round(
    (completedTopics / topics.length) * 100
  );

  // ===============================
  // LEETCODE PROGRESS
  // ===============================

  const leetcodeSolved =
    leetcodeStats?.totalSolved || 0;

  // This is the real total number of
  // questions available on LeetCode.
  const totalLeetcodeQuestions =
    leetcodeStats?.totalQuestions || 0;

  const overallProgress =
    connected &&
    leetcodeStats &&
    totalLeetcodeQuestions > 0
      ? Math.min(
          100,
          Math.round(
            (leetcodeSolved /
              totalLeetcodeQuestions) *
              100
          )
        )
      : topicProgress;

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="dsa-page">
        <div className="dsa-header">
          <div>
            <p className="dsa-label">
              DSA Tracker
            </p>

            <h1>
              Data Structures & Algorithms
            </h1>

            <p>
              Loading your DSA progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div className="dsa-page">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="dsa-header">

        <div>

          <p className="dsa-label">
            DSA Tracker
          </p>

          <h1>
            Data Structures & Algorithms
          </h1>

          <p>
            Track your problem-solving progress
            and stay consistent with your DSA
            preparation.
          </p>

        </div>

        <div className="dsa-progress">

          <span>
            Overall Progress
          </span>

          <strong>
            {overallProgress}%
          </strong>

        </div>

      </div>


      {/* ===============================
          LEETCODE CONNECTION
      =============================== */}

      <div className="leetcode-card">

        <div className="leetcode-header">

          <div>

            <p className="leetcode-label">
              🔗 LeetCode Integration
            </p>

            <h2>
              Connect Your LeetCode Profile
            </h2>

            <p>
              Connect your LeetCode username to
              track your real problem-solving
              progress in CareerPilot.
            </p>

          </div>

          <div className="leetcode-icon">
            LC
          </div>

        </div>


        {!connected ? (

          <form
            className="leetcode-form"
            onSubmit={
              handleConnectLeetCode
            }
          >

            <input
              type="text"
              value={leetcodeUsername}
              onChange={(event) =>
                setLeetcodeUsername(
                  event.target.value
                )
              }
              placeholder="Enter your LeetCode username"
            />

            <button type="submit">
              Connect
            </button>

          </form>

        ) : (

          <div className="leetcode-connected">

            <div>

              <span>
                ✓ Connected
              </span>

              <h3>
                {leetcodeUsername}
              </h3>

            </div>

            <button
              onClick={
                handleDisconnect
              }
            >
              Disconnect
            </button>

          </div>

        )}

      </div>


      {/* ===============================
          OVERALL PROGRESS BAR
      =============================== */}

      <div className="dsa-progress-bar">

        <div
          className="dsa-progress-fill"
          style={{
            width: `${overallProgress}%`,
          }}
        ></div>

      </div>


      {/* ===============================
          STATISTICS
      =============================== */}

      <div className="dsa-stats">

        {/* Total Problems */}

        <div className="dsa-stat-card">

          <span>
            🧩
          </span>

          <p>
            Total LeetCode Questions
          </p>

          <h2>
            {connected &&
            leetcodeStats
              ? leetcodeStats.totalQuestions ||
                "—"
              : "—"}
          </h2>

        </div>


        {/* Problems Solved */}

        <div className="dsa-stat-card">

          <span>
            ✅
          </span>

          <p>
            Problems Solved
          </p>

          <h2>
            {connected &&
            leetcodeStats
              ? leetcodeStats.totalSolved
              : "—"}
          </h2>

        </div>


        {/* Topics */}

        <div className="dsa-stat-card">

          <span>
            📚
          </span>

          <p>
            Topics Completed
          </p>

          <h2>
            {completedTopics}/
            {topics.length}
          </h2>

        </div>

      </div>


      {/* ===============================
          LEETCODE STATS
      =============================== */}

      {connected && (

        <div className="leetcode-stats">

          <div className="dsa-section-header">

            <div>

              <h2>
                LeetCode Stats
              </h2>

              <p>
                Real-time statistics from your
                connected LeetCode profile.
              </p>

            </div>

          </div>


          {statsLoading ? (

            <p>
              Loading LeetCode statistics...
            </p>

          ) : (

            <div className="leetcode-stat-grid">

              {/* Problems Solved */}

              <div className="leetcode-stat-card">

                <span>
                  🧩
                </span>

                <p>
                  Problems Solved
                </p>

                <h2>
                  {leetcodeStats
                    ? leetcodeStats.totalSolved
                    : "—"}
                </h2>

              </div>


              {/* Easy */}

              <div className="leetcode-stat-card">

                <span>
                  🟢
                </span>

                <p>
                  Easy
                </p>

                <h2>
                  {leetcodeStats
                    ? leetcodeStats.easySolved
                    : "—"}
                </h2>

              </div>


              {/* Medium */}

              <div className="leetcode-stat-card">

                <span>
                  🟡
                </span>

                <p>
                  Medium
                </p>

                <h2>
                  {leetcodeStats
                    ? leetcodeStats.mediumSolved
                    : "—"}
                </h2>

              </div>


              {/* Hard */}

              <div className="leetcode-stat-card">

                <span>
                  🔴
                </span>

                <p>
                  Hard
                </p>

                <h2>
                  {leetcodeStats
                    ? leetcodeStats.hardSolved
                    : "—"}
                </h2>

              </div>

            </div>

          )}

        </div>

      )}


      {/* ===============================
          DSA TOPICS
      =============================== */}

      <div className="dsa-section">

        <div className="dsa-section-header">

          <div>

            <h2>
              DSA Topics
            </h2>

            <p>
              Mark topics as completed as you
              learn and practice them.
            </p>

          </div>

        </div>


        <div className="dsa-topic-list">

          {topics.map((topic) => (

            <div
              className={`dsa-topic ${
                topic.completed
                  ? "topic-completed"
                  : ""
              }`}
              key={topic.id}
            >

              {/* Topic Information */}

              <div className="topic-info">

                <div className="topic-title">

                  <div className="topic-number">

                    {topic.completed
                      ? "✓"
                      : topic.id}

                  </div>

                  <div>

                    <h3>
                      {topic.name}
                    </h3>

                    <p>
                      {topic.completed
                        ? "Topic completed"
                        : "Not completed yet"}
                    </p>

                  </div>

                </div>

              </div>


              {/* Topic Progress */}

              <div className="topic-progress-bar">

                <div
                  className="topic-progress-fill"
                  style={{
                    width: topic.completed
                      ? "100%"
                      : "0%",
                  }}
                ></div>

              </div>


              {/* Button */}

              <button
                className="topic-button"
                onClick={() =>
                  toggleTopic(topic.id)
                }
              >

                {topic.completed
                  ? "Mark Incomplete"
                  : "Mark Complete"}

              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default DSA;