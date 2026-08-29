import { useState } from "react";
import "./DSA.css";

function DSA() {
  const [topics, setTopics] = useState([
    {
      id: 1,
      name: "Arrays",
      problems: 25,
      solved: 18,
      completed: false,
    },
    {
      id: 2,
      name: "Strings",
      problems: 20,
      solved: 12,
      completed: false,
    },
    {
      id: 3,
      name: "Linked Lists",
      problems: 15,
      solved: 8,
      completed: false,
    },
    {
      id: 4,
      name: "Stacks & Queues",
      problems: 15,
      solved: 10,
      completed: false,
    },
    {
      id: 5,
      name: "Trees",
      problems: 20,
      solved: 5,
      completed: false,
    },
    {
      id: 6,
      name: "Graphs",
      problems: 20,
      solved: 3,
      completed: false,
    },
  ]);

  const toggleTopic = (id) => {
    setTopics(
      topics.map((topic) =>
        topic.id === id
          ? { ...topic, completed: !topic.completed }
          : topic
      )
    );
  };

  const totalProblems = topics.reduce(
    (total, topic) => total + topic.problems,
    0
  );

  const totalSolved = topics.reduce(
    (total, topic) => total + topic.solved,
    0
  );

  const overallProgress = Math.round(
    (totalSolved / totalProblems) * 100
  );

  const completedTopics = topics.filter(
    (topic) => topic.completed
  ).length;

  return (
    <div className="dsa-page">

      {/* Header */}
      <div className="dsa-header">

        <div>
          <p className="dsa-label">
            DSA Tracker
          </p>

          <h1>
            Data Structures & Algorithms
          </h1>

          <p>
            Track your problem-solving progress and stay
            consistent with your DSA preparation.
          </p>
        </div>

        <div className="dsa-progress">
          <span>Overall Progress</span>
          <strong>{overallProgress}%</strong>
        </div>

      </div>

      {/* Overall Progress */}
      <div className="dsa-progress-bar">

        <div
          className="dsa-progress-fill"
          style={{ width: `${overallProgress}%` }}
        ></div>

      </div>

      {/* Statistics */}
      <div className="dsa-stats">

        <div className="dsa-stat-card">
          <span>🧩</span>
          <p>Total Problems</p>
          <h2>{totalProblems}</h2>
        </div>

        <div className="dsa-stat-card">
          <span>✅</span>
          <p>Problems Solved</p>
          <h2>{totalSolved}</h2>
        </div>

        <div className="dsa-stat-card">
          <span>📚</span>
          <p>Topics Completed</p>
          <h2>
            {completedTopics}/{topics.length}
          </h2>
        </div>

      </div>

      {/* Topics */}
      <div className="dsa-section">

        <div className="dsa-section-header">
          <div>
            <h2>DSA Topics</h2>
            <p>
              Work through each topic and track your progress.
            </p>
          </div>
        </div>

        <div className="dsa-topic-list">

          {topics.map((topic) => {

            const topicProgress = Math.round(
              (topic.solved / topic.problems) * 100
            );

            return (
              <div
                className={`dsa-topic ${
                  topic.completed ? "topic-completed" : ""
                }`}
                key={topic.id}
              >

                <div className="topic-info">

                  <div className="topic-title">

                    <div className="topic-number">
                      {topic.completed ? "✓" : topic.id}
                    </div>

                    <div>
                      <h3>{topic.name}</h3>

                      <p>
                        {topic.solved} of {topic.problems} problems solved
                      </p>
                    </div>

                  </div>

                  <strong>
                    {topicProgress}%
                  </strong>

                </div>

                <div className="topic-progress-bar">

                  <div
                    className="topic-progress-fill"
                    style={{
                      width: `${topicProgress}%`,
                    }}
                  ></div>

                </div>

                <button
                  className="topic-button"
                  onClick={() => toggleTopic(topic.id)}
                >
                  {topic.completed
                    ? "Mark Incomplete"
                    : "Mark Complete"}
                </button>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default DSA;