import { useState,useRef,useEffect} from "react";
import ReactMarkdown from "react-markdown";
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

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "How should I prepare for placements?",
    "Give me a DSA study plan",
    "How can I improve my resume?",
    "What should I prepare for technical interviews?",
  ];

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async (messageText) => {
    const trimmedInput = messageText.trim();

    if (!trimmedInput || isTyping) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Show user message immediately
    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: trimmedInput,
      },
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: trimmedInput,
          }),
        }
      );

      const data = await response.json();

      // =========================
      // AUTH ERROR
      // =========================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {
        throw new Error(
          data.message || "AI request failed."
        );
      }

      // =========================
      // AI RESPONSE
      // =========================

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text:
            data.reply ||
            "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("AI error:", error);

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text:
            "Sorry, I couldn't connect to CareerPilot AI right now. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // =========================
  // FORM SUBMIT
  // =========================

  const handleSend = async (event) => {
    event.preventDefault();

    await sendMessage(input);
  };

  // =========================
  // SUGGESTION CLICK
  // =========================

  const handleSuggestion = async (question) => {
    await sendMessage(question);
  };

  // =========================
  // BACK TO DASHBOARD
  // =========================

  const handleBack = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="ai-page">

      {/* =========================
          HEADER
      ========================= */}

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


      {/* =========================
          MAIN
      ========================= */}

      <main className="ai-container">

        {/* =========================
            INTRO
        ========================= */}

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


        {/* =========================
            SUGGESTED QUESTIONS
        ========================= */}

        {messages.length === 1 && !isTyping && (
          <div className="suggested-questions">

            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() =>
                  handleSuggestion(question)
                }
              >
                {question}

                <span>
                  →
                </span>
              </button>
            ))}

          </div>
        )}


        {/* =========================
            CHAT BOX
        ========================= */}

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

                {/* AI Avatar */}

                {message.sender === "ai" && (
                  <div className="message-avatar">
                    ✦
                  </div>
                )}


                {/* Message */}

                <div
  className={`message ${
    message.sender === "user"
      ? "user-message"
      : "ai-message"
  }`}
>
  {message.sender === "ai" ? (
    <ReactMarkdown>
      {message.text}
    </ReactMarkdown>
  ) : (
    message.text
  )}
</div>

              </div>

            ))}


            {/* =========================
                TYPING INDICATOR
            ========================= */}

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


            {/* Auto-scroll target */}

            <div ref={messagesEndRef} />

          </div>


          {/* =========================
              INPUT
          ========================= */}

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
              disabled={
                !input.trim() || isTyping
              }
            >
              Send
              <span>→</span>
            </button>

          </form>


          {/* =========================
              DISCLAIMER
          ========================= */}

          <p className="ai-disclaimer">
            CareerPilot AI provides guidance for
            educational and career preparation purposes.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AIAssistant;