import { useEffect, useState } from "react";
import "./Roadmap.css";

function Roadmap() {
  // ===============================
  // ROADMAP STEPS
  // ===============================

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Programming Fundamentals",
      description:
        "Build a strong foundation in programming and problem solving.",
      skills: ["C / C++", "Java", "Basic Programming"],
      completed: true,
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      description:
        "Practice DSA concepts and improve your problem-solving skills.",
      skills: [
        "Arrays",
        "Strings",
        "Linked Lists",
        "Stacks & Queues",
      ],
      completed: false,
    },
    {
      id: 3,
      title: "Core Computer Science",
      description:
        "Strengthen the concepts commonly asked in placement interviews.",
      skills: [
        "DBMS",
        "Operating Systems",
        "Computer Networks",
      ],
      completed: false,
    },
    {
      id: 4,
      title: "Development Skills",
      description:
        "Learn the tools and technologies needed to build real projects.",
      skills: [
        "HTML & CSS",
        "JavaScript",
        "React",
        "Backend",
      ],
      completed: false,
    },
    {
      id: 5,
      title: "Interview Preparation",
      description:
        "Prepare for technical, behavioral and HR interview rounds.",
      skills: [
        "Technical Interviews",
        "HR Questions",
        "Mock Interviews",
      ],
      completed: false,
    },
  ]);

  const [loading, setLoading] = useState(true);

  const [updatingStep, setUpdatingStep] = useState(null);

  // ===============================
  // GET ROADMAP FROM MONGODB
  // ===============================

  useEffect(() => {
    const fetchRoadmap = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/roadmap",
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

        const savedCompletion =
          data.roadmap?.stepCompletion || {};

        setSteps((currentSteps) =>
          currentSteps.map((step) => ({
            ...step,
            completed:
              savedCompletion[String(step.id)] ??
              step.completed,
          }))
        );
      } catch (error) {
        console.error(
          "Roadmap fetch error:",
          error
        );

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  // ===============================
  // TOGGLE ROADMAP STEP
  // ===============================

  const toggleStep = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      window.location.href = "/login";
      return;
    }

    const currentStep = steps.find(
      (step) => step.id === id
    );

    if (!currentStep) {
      return;
    }

    const newCompleted =
      !currentStep.completed;

    // Optimistically update UI
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === id
          ? {
              ...step,
              completed: newCompleted,
            }
          : step
      )
    );

    setUpdatingStep(id);

    try {
      const response = await fetch(
        "http://localhost:5000/api/roadmap/step",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stepId: id,
            completed: newCompleted,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Revert UI if backend failed
        setSteps((currentSteps) =>
          currentSteps.map((step) =>
            step.id === id
              ? {
                  ...step,
                  completed:
                    currentStep.completed,
                }
              : step
          )
        );

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
    } catch (error) {
      console.error(
        "Roadmap update error:",
        error
      );

      // Revert UI if request failed
      setSteps((currentSteps) =>
        currentSteps.map((step) =>
          step.id === id
            ? {
                ...step,
                completed:
                  currentStep.completed,
              }
            : step
        )
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setUpdatingStep(null);
    }
  };

  // ===============================
  // COMPLETED STEPS
  // ===============================

  const completedSteps = steps.filter(
    (step) => step.completed
  ).length;

  // ===============================
  // OVERALL PROGRESS
  // ===============================

  const progress =
    steps.length > 0
      ? Math.round(
          (completedSteps / steps.length) *
            100
        )
      : 0;

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-header">
          <div>
            <p className="roadmap-label">
              Career Roadmap
            </p>

            <h1>
              Software Developer Roadmap
            </h1>

            <p>
              Loading your roadmap...
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
    <div className="roadmap-page">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="roadmap-header">

        <div>

          <p className="roadmap-label">
            Career Roadmap
          </p>

          <h1>
            Software Developer Roadmap
          </h1>

          <p>
            Follow your personalized path and
            build the skills required for your
            target role.
          </p>

        </div>

        <div className="roadmap-progress">

          <span>
            Overall Progress
          </span>

          <strong>
            {progress}%
          </strong>

        </div>

      </div>


      {/* ===============================
          PROGRESS BAR
      =============================== */}

      <div className="roadmap-progress-bar">

        <div
          className="roadmap-progress-fill"
          style={{
            width: `${progress}%`,
          }}
        ></div>

      </div>


      {/* ===============================
          ROADMAP STEPS
      =============================== */}

      <div className="roadmap-container">

        {steps.map((step) => (

          <div
            key={step.id}
            className={`roadmap-step ${
              step.completed
                ? "completed"
                : ""
            } ${
              step.id === 2 &&
              !step.completed
                ? "active"
                : ""
            }`}
          >

            {/* Step Number */}

            <div className="step-number">

              {step.completed
                ? "✓"
                : step.id}

            </div>


            {/* Step Content */}

            <div className="step-content">

              <span className="step-status">

                {step.completed
                  ? "Completed"
                  : step.id === 2
                  ? "In Progress"
                  : "Upcoming"}

              </span>


              <h2>
                {step.title}
              </h2>


              <p>
                {step.description}
              </p>


              {/* Skills */}

              <div className="skill-list">

                {step.skills.map(
                  (skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  )
                )}

              </div>


              {/* Complete Button */}

              <button
                className="complete-button"
                onClick={() =>
                  toggleStep(step.id)
                }
                disabled={
                  updatingStep === step.id
                }
              >

                {updatingStep === step.id
                  ? "Saving..."
                  : step.completed
                  ? "Mark Incomplete"
                  : "Mark Complete"}

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Roadmap;