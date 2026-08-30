import { useState } from "react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "CareerPilot User",
    email: "user@example.com",
    college: "",
    degree: "",
    skills: "",
    careerGoal: "Software Developer",
    experience: "Fresher",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile({
      ...profile,
      [name]: value,
    });

    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "careerPilotProfile",
      JSON.stringify(profile)
    );

    setSaved(true);
  };

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <div>
          <p className="profile-label">My Profile</p>

          <h1>Build Your Career Profile</h1>

          <p>
            Add your details so CareerPilot can personalize
            your career preparation.
          </p>
        </div>

        <div className="profile-avatar">
          CP
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-card">

        <form onSubmit={handleSave}>

          <div className="form-grid">

            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* College */}
            <div className="form-group">
              <label>College / University</label>

              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Enter your college"
              />
            </div>

            {/* Degree */}
            <div className="form-group">
              <label>Degree</label>

              <input
                type="text"
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>

            {/* Career Goal */}
            <div className="form-group">
              <label>Career Goal</label>

              <select
                name="careerGoal"
                value={profile.careerGoal}
                onChange={handleChange}
              >
                <option>Software Developer</option>
                <option>Data Scientist</option>
                <option>Data Analyst</option>
                <option>Web Developer</option>
                <option>AI / ML Engineer</option>
                <option>Cybersecurity Engineer</option>
                <option>Other</option>
              </select>
            </div>

            {/* Experience */}
            <div className="form-group">
              <label>Experience Level</label>

              <select
                name="experience"
                value={profile.experience}
                onChange={handleChange}
              >
                <option>Fresher</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Experienced</option>
              </select>
            </div>

          </div>

          {/* Skills */}
          <div className="form-group full-width">
            <label>Skills</label>

            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="e.g. C, C++, Java, Python, React, SQL"
              rows="4"
            ></textarea>

            <small>
              Separate multiple skills with commas.
            </small>
          </div>

          {/* Save */}
          <div className="profile-actions">

            {saved && (
              <span className="saved-message">
                ✓ Profile saved successfully
              </span>
            )}

            <button
              type="submit"
              className="save-profile-button"
            >
              Save Profile
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Profile;