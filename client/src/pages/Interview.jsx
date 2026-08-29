import { useState } from "react";
import "./Interview.css";

function Interview() {
  const [categories, setCategories] = useState([
    {
      id: 1,
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

  const markComplete = (id) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? {
              ...category,
              completed: !category.completed,
              progress: category.completed ? category.progress : 100,
            }
          : category
      )
    );
  };

  const totalProgress = Math.round(
    categories.reduce(
      (total, category) => total + category.progress,
      0
    ) / categories.length
  );

  return (
    <div className="interview-page">

      {/* Header */}
      <div className="interview-header">

        <div>
          <p className="interview-label">
            Interview Preparation
          </p>

          <h1>
            Prepare for Your Interviews
          </h1>

          <p>
            Build confidence and prepare for technical, HR and
            mock interviews.
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

      {/* Progress Bar */}
      <div className="interview-progress-bar">

        <div
          className="interview-progress-fill"
          style={{ width: `${totalProgress}%` }}
        ></div>

      </div>

      {/* Preparation Cards */}
      <div className="interview-cards">

        {categories.map((category) => (

          <div
            className={`interview-card ${
              category.completed ? "interview-completed" : ""
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

              {category.topics.map((topic) => (
                <span key={topic}>
                  {topic}
                </span>
              ))}

            </div>

            <div className="category-progress-bar">

              <div
                className="category-progress-fill"
                style={{
                  width: `${category.progress}%`,
                }}
              ></div>

            </div>

            <button
              className="interview-button"
              onClick={() => markComplete(category.id)}
            >
              {category.completed
                ? "Mark Incomplete"
                : "Mark Complete"}
            </button>

          </div>

        ))}

      </div>

      {/* Practice Section */}
      <div className="practice-section">

        <div>
          <h2>
            Ready to practice?
          </h2>

          <p>
            Start with common interview questions and improve
            your answers step by step.
          </p>
        </div>

        <button
          className="practice-button"
          onClick={() => alert("Interview practice coming soon!")}
        >
          Start Practice
        </button>

      </div>

    </div>
  );
}

export default Interview;