import { useEffect, useState } from "react";
import "./Resume.css";

function Resume() {
  const emptyResume = {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    education: "",
    skills: "",
    projects: "",
    experience: "",
  };

  const [resume, setResume] = useState(emptyResume);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET RESUME FROM MONGODB
  // =====================================================

  useEffect(() => {
    const fetchResume = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/resume",
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

        setResume(data.resume || emptyResume);
      } catch (error) {
        console.error("Get resume error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setResume((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  // =====================================================
  // SAVE RESUME TO MONGODB
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/resume",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(resume),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to save resume.");

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

      setResume(data.resume);
      setSaved(true);

    } catch (error) {
      console.error("Save resume error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="resume-page">
        <div className="resume-builder-header">
          <div>
            <p className="resume-label">
              CAREERPILOT AI
            </p>

            <h1>Resume Builder</h1>

            <p className="resume-description">
              Loading your resume...
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
    <div className="resume-page">

      {/* Builder Header */}
      <div className="resume-builder-header">

        <div>
          <p className="resume-label">
            CAREERPILOT AI
          </p>

          <h1>
            Resume Builder
          </h1>

          <p className="resume-description">
            Create a professional, placement-ready resume.
          </p>
        </div>

        <div className="resume-header-badge">
          ✦ AI Ready
        </div>

      </div>


      {/* Builder Workspace */}
      <div className="resume-workspace">

        {/* LEFT SIDE - FORM */}
        <div className="resume-editor">

          <div className="editor-heading">
            <div>
              <h2>
                Resume Details
              </h2>

              <p>
                Fill in your information below.
              </p>
            </div>
          </div>


          <form onSubmit={handleSave}>

            {/* Personal Information */}
            <div className="editor-section">

              <div className="section-title">

                <span>
                  01
                </span>

                <div>
                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Your contact details
                  </p>
                </div>

              </div>


              <div className="input-grid">

                <div className="input-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={resume.name}
                    onChange={handleChange}
                    placeholder="e.g. Ishita Duggal"
                    required
                  />

                </div>


                <div className="input-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={resume.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />

                </div>


                <div className="input-group">

                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={resume.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />

                </div>


                <div className="input-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={resume.location}
                    onChange={handleChange}
                    placeholder="New Delhi, India"
                  />

                </div>


                <div className="input-group">

                  <label>
                    LinkedIn
                  </label>

                  <input
                    type="text"
                    name="linkedin"
                    value={resume.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/yourname"
                  />

                </div>


                <div className="input-group">

                  <label>
                    GitHub
                  </label>

                  <input
                    type="text"
                    name="github"
                    value={resume.github}
                    onChange={handleChange}
                    placeholder="github.com/yourusername"
                  />

                </div>

              </div>

            </div>


            {/* Summary */}
            <div className="editor-section">

              <div className="section-title">

                <span>
                  02
                </span>

                <div>
                  <h3>
                    Professional Summary
                  </h3>

                  <p>
                    Introduce yourself professionally
                  </p>
                </div>

              </div>


              <div className="input-group">

                <textarea
                  name="summary"
                  value={resume.summary}
                  onChange={handleChange}
                  placeholder="Write 2–4 lines about your background, strengths and career goals..."
                  rows="5"
                />

              </div>

            </div>


            {/* Education */}
            <div className="editor-section">

              <div className="section-title">

                <span>
                  03
                </span>

                <div>
                  <h3>
                    Education
                  </h3>

                  <p>
                    Highlight your academic background
                  </p>
                </div>

              </div>


              <div className="input-group">

                <textarea
                  name="education"
                  value={resume.education}
                  onChange={handleChange}
                  placeholder={"B.Tech in Computer Science\nXYZ University | 2023 – 2027\nCGPA: 8.5/10"}
                  rows="6"
                />

              </div>

            </div>


            {/* Skills */}
            <div className="editor-section">

              <div className="section-title">

                <span>
                  04
                </span>

                <div>
                  <h3>
                    Skills
                  </h3>

                  <p>
                    List your technical and professional skills
                  </p>
                </div>

              </div>


              <div className="input-group">

                <textarea
                  name="skills"
                  value={resume.skills}
                  onChange={handleChange}
                  placeholder="Java, C++, Python, React, SQL, Git, Data Structures..."
                  rows="4"
                />

              </div>

            </div>


            {/* Projects */}
            <div className="editor-section">

              <div className="section-title">

                <span>
                  05
                </span>

                <div>
                  <h3>
                    Projects
                  </h3>

                  <p>
                    Showcase your strongest projects
                  </p>
                </div>

              </div>


              <div className="input-group">

                <textarea
                  name="projects"
                  value={resume.projects}
                  onChange={handleChange}
                  placeholder={"CareerPilot AI\n• Built a career preparation platform using React.\n• Implemented personalized dashboards and tracking.\n• Technologies: React, JavaScript, CSS"}
                  rows="8"
                />

              </div>

            </div>


            {/* Experience */}
            <div className="editor-section">

              <div className="section-title">

                <span>
                  06
                </span>

                <div>
                  <h3>
                    Experience
                  </h3>

                  <p>
                    Add internships, jobs or relevant experience
                  </p>
                </div>

              </div>


              <div className="input-group">

                <textarea
                  name="experience"
                  value={resume.experience}
                  onChange={handleChange}
                  placeholder={"Software Developer Intern\nABC Technologies | June 2026 – August 2026\n• Worked on frontend development.\n• Collaborated with the development team."}
                  rows="8"
                />

              </div>

            </div>


            {/* Save */}
            <div className="save-area">

              {saved && (
                <span className="save-message">
                  ✓ Resume saved
                </span>
              )}

              <button
                type="submit"
                className="save-resume-button"
              >
                Save Resume
              </button>

            </div>

          </form>

        </div>


        {/* RIGHT SIDE - PREVIEW */}
        <div className="resume-preview-area">

          <div className="preview-top">

            <div>

              <h2>
                Live Preview
              </h2>

              <p>
                Your resume updates as you type.
              </p>

            </div>

            <span className="preview-status">
              ● Live
            </span>

          </div>


          <div className="resume-paper">

            {/* Resume Header */}
            <div className="paper-header">

              <h1>
                {resume.name || "YOUR NAME"}
              </h1>


              <div className="contact-line">

                {resume.email && (
                  <span>
                    {resume.email}
                  </span>
                )}

                {resume.phone && (
                  <span>
                    {resume.phone}
                  </span>
                )}

                {resume.location && (
                  <span>
                    {resume.location}
                  </span>
                )}

              </div>


              {(resume.linkedin || resume.github) && (

                <div className="contact-line secondary">

                  {resume.linkedin && (
                    <span>
                      {resume.linkedin}
                    </span>
                  )}

                  {resume.github && (
                    <span>
                      {resume.github}
                    </span>
                  )}

                </div>

              )}

            </div>


            {/* Summary */}
            {resume.summary && (

              <div className="paper-section">

                <h3>
                  PROFESSIONAL SUMMARY
                </h3>

                <p>
                  {resume.summary}
                </p>

              </div>

            )}


            {/* Education */}
            {resume.education && (

              <div className="paper-section">

                <h3>
                  EDUCATION
                </h3>

                <p className="preformatted">
                  {resume.education}
                </p>

              </div>

            )}


            {/* Skills */}
            {resume.skills && (

              <div className="paper-section">

                <h3>
                  TECHNICAL SKILLS
                </h3>

                <p>
                  {resume.skills}
                </p>

              </div>

            )}


            {/* Projects */}
            {resume.projects && (

              <div className="paper-section">

                <h3>
                  PROJECTS
                </h3>

                <p className="preformatted">
                  {resume.projects}
                </p>

              </div>

            )}


            {/* Experience */}
            {resume.experience && (

              <div className="paper-section">

                <h3>
                  EXPERIENCE
                </h3>

                <p className="preformatted">
                  {resume.experience}
                </p>

              </div>

            )}


            {/* Empty State */}
            {!resume.summary &&
              !resume.education &&
              !resume.skills &&
              !resume.projects &&
              !resume.experience && (

                <div className="preview-empty">

                  <div className="empty-icon">
                    ✦
                  </div>

                  <h3>
                    Your resume will appear here
                  </h3>

                  <p>
                    Start filling in your information
                    to see the live preview.
                  </p>

                </div>

              )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Resume;