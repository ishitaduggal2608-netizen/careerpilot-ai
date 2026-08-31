import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    skills: "",
    careerGoal: "Software Developer",
    experience: "Fresher",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }

        alert(data.message || "Unable to fetch profile.");
        return;
      }

      if (data.profile) {
        setProfile({
          name: data.profile.name || "",
          email: data.profile.email || "",
          college: data.profile.college || "",
          degree: data.profile.degree || "",
          skills: data.profile.skills || "",
          careerGoal:
            data.profile.careerGoal || "Software Developer",
          experience:
            data.profile.experience || "Fresher",
        });

        // Keep localStorage user information synchronized
        updateLocalUser(data.profile);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "/login";
  };

  // ==========================================
  // UPDATE LOCAL USER
  // ==========================================

  const updateLocalUser = (userData) => {
    const existingUser = localStorage.getItem("user");

    let oldUser = {};

    try {
      oldUser = existingUser
        ? JSON.parse(existingUser)
        : {};
    } catch {
      oldUser = {};
    }

    const updatedUser = {
      ...oldUser,
      id: userData._id || oldUser.id,
      name: userData.name,
      email: userData.email,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));

    setSaved(false);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      logout();
      return;
    }

    // Basic validation
    if (!profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!profile.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      setSaving(true);
      setSaved(false);

      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name.trim(),
            email: profile.email.trim(),
            college: profile.college.trim(),
            degree: profile.degree.trim(),
            skills: profile.skills.trim(),
            careerGoal: profile.careerGoal,
            experience: profile.experience,
          }),
        }
      );

      const data = await response.json();

      console.log("PROFILE SAVE RESPONSE:", data);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }

        alert(data.message || "Unable to save profile.");
        return;
      }

      // ==========================================
      // IMPORTANT:
      // Update React state immediately from backend
      // ==========================================

      if (data.profile) {
        const updatedProfile = {
          name: data.profile.name || "",
          email: data.profile.email || "",
          college: data.profile.college || "",
          degree: data.profile.degree || "",
          skills: data.profile.skills || "",
          careerGoal:
            data.profile.careerGoal ||
            "Software Developer",
          experience:
            data.profile.experience ||
            "Fresher",
        };

        setProfile(updatedProfile);

        // Update localStorage as well
        updateLocalUser(data.profile);
      }

      setSaved(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Profile save error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="profile-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="profile-header">

        <div>
          <p className="profile-label">
            My Profile
          </p>

          <h1>
            Build Your Career Profile
          </h1>

          <p>
            Add your details so CareerPilot can
            personalize your career preparation.
          </p>
        </div>

        <div className="profile-avatar">
          CP
        </div>

      </div>


      {/* ================================
          PROFILE FORM
      ================================= */}

      <div className="profile-card">

        <form onSubmit={handleSave}>

          <div className="form-grid">

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>


            {/* COLLEGE */}

            <div className="form-group">

              <label>
                College / University
              </label>

              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Enter your college"
              />

            </div>


            {/* DEGREE */}

            <div className="form-group">

              <label>
                Degree
              </label>

              <input
                type="text"
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
              />

            </div>


            {/* CAREER GOAL */}

            <div className="form-group">

              <label>
                Career Goal
              </label>

              <select
                name="careerGoal"
                value={profile.careerGoal}
                onChange={handleChange}
              >
                <option value="Software Developer">
                  Software Developer
                </option>

                <option value="Data Scientist">
                  Data Scientist
                </option>

                <option value="Data Analyst">
                  Data Analyst
                </option>

                <option value="Web Developer">
                  Web Developer
                </option>

                <option value="AI / ML Engineer">
                  AI / ML Engineer
                </option>

                <option value="Cybersecurity Engineer">
                  Cybersecurity Engineer
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>


            {/* EXPERIENCE */}

            <div className="form-group">

              <label>
                Experience Level
              </label>

              <select
                name="experience"
                value={profile.experience}
                onChange={handleChange}
              >
                <option value="Fresher">
                  Fresher
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Experienced">
                  Experienced
                </option>
              </select>

            </div>

          </div>


          {/* ================================
              SKILLS
          ================================= */}

          <div className="form-group full-width">

            <label>
              Skills
            </label>

            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="e.g. C, C++, Java, Python, React, SQL"
              rows="4"
            />

            <small>
              Separate multiple skills with commas.
            </small>

          </div>


          {/* ================================
              SAVE BUTTON
          ================================= */}

          <div className="profile-actions">

            {saved && (
              <span className="saved-message">
                ✓ Profile saved successfully
              </span>
            )}

            <button
              type="submit"
              className="save-profile-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Profile;