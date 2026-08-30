import { useState } from "react";
import "./AIAssistant.css";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm CareerPilot AI 👋 How can I help you with your placement preparation today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "How should I prepare for placements?",
    "Give me a DSA study plan",
    "How can I improve my resume?",
    "What should I prepare for technical interviews?",
  ];

  const generateResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("dsa") ||
      lowerQuestion.includes("data structure")
    ) {
      return "Start with Arrays, Strings, Linked Lists, Stacks, Queues, Trees and Graphs. Practice problems consistently and focus on understanding the approach rather than memorizing solutions.";
    }

    if (
      lowerQuestion.includes("resume") ||
      lowerQuestion.includes("cv")
    ) {
      return "A strong resume should be concise and achievement-focused. Highlight your technical skills, strongest projects, education and relevant experience. Quantify your achievements whenever possible.";
    }

    if (
      lowerQuestion.includes("interview") ||
      lowerQuestion.includes("technical")
    ) {
      return "For technical interviews, prepare DSA, OOP, DBMS, Operating Systems, Computer Networks and questions related to your projects. Practice explaining your approach clearly.";
    }

    if (
      lowerQuestion.includes("placement") ||
      lowerQuestion.includes("prepare")
    ) {
      return "A good placement strategy is to work on DSA, core CS subjects, projects, your resume and interview communication together. Set weekly goals and track your progress consistently.";
    }

    return "That's a great question! I can help you with DSA, technical interviews, resume preparation, career planning and placement preparation. Tell me what you'd like to work on.";
  };

  const handleSend = (event) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isTyping) {
      return;
    }

    const userMessage = {
      sender: "user",
      text: trimmedInput,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        sender: "ai",
        text: generateResponse(trimmedInput),
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);

      setIsTyping(false);
    }, 800);
  };

  const handleSuggestion = (question) => {
    setInput(question);
  };

  const handleBack = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="ai-page">

      {/* Header */}
      <header className="ai-header">

        <div className="ai-brand">

          <div className="ai-brand-icon">
            ✦
          </div>

          <div>
            <h1>CareerPilot AI</h1>

            <p>
              Your personal career assistant
            </p>
          </div>

        </div>


        <button
          className="ai-back-button"
          onClick={handleBack}
        >
          ← Dashboard
        </button>

      </header>


      {/* Main Chat Area */}
      <main className="ai-container">

        {/* Intro */}
        <div className="ai-intro">

          <div className="ai-main-icon">
            ✦
          </div>

          <h2>
            How can I help you today?
          </h2>

          <p>
            Get guidance for your placement preparation,
            resume, DSA and technical interviews.
          </p>

        </div>


        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="suggested-questions">

            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSuggestion(question)}
              >
                {question}
                <span>→</span>
              </button>
            ))}

          </div>
        )}


        {/* Chat */}
        <div className="chat-box">

          <div className="messages">

            {messages.map((message, index) => (

              <div
                key={index}
                className={`message-row ${
                  message.sender === "user"
                    ? "user-row"
                    : "ai-row"
                }`}
              >

                {message.sender === "ai" && (
                  <div className="message-avatar">
                    ✦
                  </div>
                )}

                <div
                  className={`message ${
                    message.sender === "user"
                      ? "user-message"
                      : "ai-message"
                  }`}
                >
                  {message.text}
                </div>

              </div>

            ))}


            {/* Typing */}
            {isTyping && (
              <div className="message-row ai-row">

                <div className="message-avatar">
                  ✦
                </div>

                <div className="ai-message typing-message">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>
            )}

          </div>


          {/* Input */}
          <form
            className="chat-input-area"
            onSubmit={handleSend}
          >

            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask CareerPilot AI anything..."
              disabled={isTyping}
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
            >
              Send
              <span>→</span>
            </button>

          </form>

          <p className="ai-disclaimer">
            CareerPilot AI provides guidance for educational
            and career preparation purposes.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AIAssistant;