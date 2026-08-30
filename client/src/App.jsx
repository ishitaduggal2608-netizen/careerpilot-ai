import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import About from "./components/landing/About";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Roadmap from "./pages/Roadmap";
import DSA from "./pages/DSA";
import Interview from "./pages/Interview";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import AIAssistant from "./pages/AIAssistant";


function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
    </>
  );
}


function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    window.location.href = "/login";
    return null;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Roadmap */}
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />


        {/* DSA */}
        <Route
          path="/dsa"
          element={
            <ProtectedRoute>
              <DSA />
            </ProtectedRoute>
          }
        />


        {/* Interview */}
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />


        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* Resume */}
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />


        {/* AI Assistant */}
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;