function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-green-600">
          🌱 CareerPilot AI
        </h1>

        <div className="flex gap-8 text-gray-700">

          <a href="#">Features</a>

          <a href="#">About</a>

          <a href="#">Roadmap</a>

          <a href="#">Login</a>

          <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
            Get Started
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;