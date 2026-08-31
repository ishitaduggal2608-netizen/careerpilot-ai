import { useEffect, useState } from "react";
import "./Interview.css";

function Interview() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      key: "technical",
      title: "Technical Interview",
      icon: "💻",
      description:
        "Prepare for technical questions based on programming and computer science fundamentals.",
      topics: [
        "Programming",
        "DSA",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
      ],
      progress: 60,
      completed: false,
    },
    {
      id: 2,
      key: "hr",
      title: "HR Interview",
      icon: "💬",
      description:
        "Practice common HR and behavioral questions to improve your confidence.",
      topics: [
        "Tell me about yourself",
        "Strengths & Weaknesses",
        "Career Goals",
        "Why should we hire you?",
      ],
      progress: 45,
      completed: false,
    },
    {
      id: 3,
      key: "mock",
      title: "Mock Interview",
      icon: "🎤",
      description:
        "Test your preparation with a simulated interview experience.",
      topics: [
        "Technical Questions",
        "HR Questions",
        "Problem Solving",
        "Communication",
      ],
      progress: 20,
      completed: false,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // GET INTERVIEW DATA
  // =====================================================

  useEffect(() => {
    const fetchInterviewData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/interview",
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

        const savedCategories =
          data.interview?.categories || {};

        setCategories((currentCategories) =>
          currentCategories.map((category) => {
            const isCompleted =
              savedCategories[category.key] || false;

            return {
              ...category,
              completed: isCompleted,
              progress: isCompleted
                ? 100
                : category.progress,
            };
          })
        );
      } catch (error) {
        console.error(
          "Interview fetch error:",
          error
        );

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, []);

  // =====================================================
  // MARK CATEGORY COMPLETE / INCOMPLETE
  // =====================================================

  const markComplete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      window.location.href = "/login";
      return;
    }

    const category = categories.find(
      (item) => item.id === id
    );

    if (!category) {
      return;
    }

    const newCompleted =
      !category.completed;

    try {
      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/interview/category",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: category.key,
            completed: newCompleted,
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

      const savedCategories =
        data.interview?.categories || {};

      setCategories((currentCategories) =>
        currentCategories.map((item) => {
          const isCompleted =
            savedCategories[item.key] || false;

          return {
            ...item,
            completed: isCompleted,
            progress: isCompleted
              ? 100
              : item.progress === 100
              ? 0
              : item.progress,
          };
        })
      );
    } catch (error) {
      console.error(
        "Interview update error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // OVERALL PROGRESS
  // =====================================================

  const totalProgress = Math.round(
    categories.reduce(
      (total, category) =>
        total + category.progress,
      0
    ) / categories.length
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="interview-page">
        <div className="interview-header">
          <div>
            <p className="interview-label">
              Interview Preparation
            </p>

            <h1>
              Prepare for Your Interviews
            </h1>

            <p>
              Loading your interview progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="interview-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="interview-header">

        <div>

          <p className="interview-label">
            Interview Preparation
          </p>

          <h1>
            Prepare for Your Interviews
          </h1>

          <p>
            Build confidence and prepare for
            technical, HR and mock interviews.
          </p>

        </div>

        <div className="interview-progress">

          <span>
            Overall Progress
          </span>

          <strong>
            {totalProgress}%
          </strong>

        </div>

      </div>


      {/* =================================================
          PROGRESS BAR
      ================================================= */}

      <div className="interview-progress-bar">

        <div
          className="interview-progress-fill"
          style={{
            width: `${totalProgress}%`,
          }}
        ></div>

      </div>


      {/* =================================================
          PREPARATION CARDS
      ================================================= */}

      <div className="interview-cards">

        {categories.map((category) => (

          <div
            className={`interview-card ${
              category.completed
                ? "interview-completed"
                : ""
            }`}
            key={category.id}
          >

            <div className="interview-card-top">

              <div className="interview-icon">
                {category.icon}
              </div>

              <span>
                {category.progress}%
              </span>

            </div>


            <h2>
              {category.title}
            </h2>


            <p>
              {category.description}
            </p>


            <div className="interview-topics">

              {category.topics.map(
                (topic) => (
                  <span key={topic}>
                    {topic}
                  </span>
                )
              )}

            </div>


            {/* Category progress */}

            <div className="category-progress-bar">

              <div
                className="category-progress-fill"
                style={{
                  width: `${category.progress}%`,
                }}
              ></div>

            </div>


            {/* Complete button */}

            <button
              className="interview-button"
              onClick={() =>
                markComplete(category.id)
              }
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : category.completed
                ? "Mark Incomplete"
                : "Mark Complete"}
            </button>

          </div>

        ))}

      </div>


      {/* =================================================
          PRACTICE SECTION
      ================================================= */}

      <div className="practice-section">

        <div>

          <h2>
            Ready to practice?
          </h2>

          <p>
            Start with common interview questions
            and improve your answers step by step.
          </p>

        </div>

        <button
          className="practice-button"
          onClick={() =>
            alert(
              "Interview practice coming soon!"
            )
          }
        >
          Start Practice
        </button>

      </div>

    </div>
  );
}

export default Interview;