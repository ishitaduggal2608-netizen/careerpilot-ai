import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import About from "./components/landing/About";
import Dashboard from "./pages/Dashboard";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;