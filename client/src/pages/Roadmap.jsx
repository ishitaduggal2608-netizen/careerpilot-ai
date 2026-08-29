import { useState } from "react";
import "./Roadmap.css";

function Roadmap() {
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
      skills: ["DBMS", "Operating Systems", "Computer Networks"],
      completed: false,
    },
    {
      id: 4,
      title: "Development Skills",
      description:
        "Learn the tools and technologies needed to build real projects.",
      skills: ["HTML & CSS", "JavaScript", "React", "Backend"],
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

  const toggleStep = (id) => {
    setSteps(
      steps.map((step) =>
        step.id === id
          ? { ...step, completed: !step.completed }
          : step
      )
    );
  };

  const completedSteps = steps.filter(
    (step) => step.completed
  ).length;

  const progress = Math.round(
    (completedSteps / steps.length) * 100
  );

  return (
    <div className="roadmap-page">

      {/* Header */}
      <div className="roadmap-header">

        <div>
          <p className="roadmap-label">
            Career Roadmap
          </p>

          <h1>
            Software Developer Roadmap
          </h1>

          <p>
            Follow your personalized path and build the skills
            required for your target role.
          </p>
        </div>

        <div className="roadmap-progress">
          <span>Overall Progress</span>

          <strong>{progress}%</strong>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="roadmap-progress-bar">

        <div
          className="roadmap-progress-fill"
          style={{ width: `${progress}%` }}
        ></div>

      </div>

      {/* Roadmap Steps */}
      <div className="roadmap-container">

        {steps.map((step) => (

          <div
            key={step.id}
            className={`roadmap-step ${
              step.completed ? "completed" : ""
            } ${step.id === 2 && !step.completed ? "active" : ""}`}
          >

            <div className="step-number">
              {step.completed ? "✓" : step.id}
            </div>

            <div className="step-content">

              <span className="step-status">
                {step.completed
                  ? "Completed"
                  : step.id === 2
                  ? "In Progress"
                  : "Upcoming"}
              </span>

              <h2>{step.title}</h2>

              <p>{step.description}</p>

              <div className="skill-list">

                {step.skills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}

              </div>

              <button
                className="complete-button"
                onClick={() => toggleStep(step.id)}
              >
                {step.completed
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