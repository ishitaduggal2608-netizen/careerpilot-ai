function Hero() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}
          <div>
            <p className="text-green-600 font-semibold text-lg mb-4">
              AI-Powered Career Preparation
            </p>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Your Career.
              <br />
              <span className="text-green-600">Your Roadmap.</span>
              <br />
              Your Future.
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl leading-relaxed">
              CareerPilot AI helps students prepare for placements with
              personalized roadmaps, skill tracking, interview preparation,
              and intelligent career guidance.
            </p>

            <div className="mt-8 flex gap-4">
              <button onClick={() => window.location.href = "/dashboard"}>
  Get Started
</button>

              <button className="border border-gray-300 text-gray-700 px-7 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                Explore Features
              </button>
            </div>
          </div>


          {/* Right Side - Dashboard Preview */}
          <div className="relative">

            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">

              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Welcome back
                  </p>

                  <h2 className="text-xl font-bold text-gray-900">
                    Your Career Dashboard
                  </h2>
                </div>

                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">
                    CP
                  </span>
                </div>
              </div>


              {/* Progress */}
              <div className="bg-gray-50 rounded-xl p-5 mb-4">

                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    Placement Readiness
                  </span>

                  <span className="text-green-600 font-semibold">
                    72%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full w-[72%]"></div>
                </div>

              </div>


              {/* Skills */}
              <div className="grid grid-cols-2 gap-4">

                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    DSA Progress
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    68%
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Interview Prep
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    54%
                  </p>
                </div>

              </div>


              {/* Roadmap */}
              <div className="mt-4 bg-green-50 rounded-xl p-4">

                <p className="text-sm text-green-700 font-semibold">
                  Today's Focus
                </p>

                <p className="text-gray-800 font-medium mt-1">
                  Complete 2 DSA problems
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Keep your placement roadmap on track.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;