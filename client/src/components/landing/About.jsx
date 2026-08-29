function About() {
  return (
    <section id="about" className="px-8 py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div>
          <p className="text-green-600 font-semibold text-lg">
            Why CareerPilot AI?
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
            Your personal
            <span className="text-green-600"> placement companion.</span>
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed mt-6">
            Placement preparation can feel overwhelming when you don't know
            what to learn, what to practice, or how prepared you actually are.
          </p>

          <p className="text-slate-600 text-lg leading-relaxed mt-4">
            CareerPilot AI brings your preparation together in one place,
            helping you understand your strengths, identify skill gaps, and
            follow a clear path toward your career goals.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Built for students
          </h3>

          <div className="space-y-6">

            <div>
              <h4 className="font-semibold text-slate-900">
                🎯 Know what to focus on
              </h4>
              <p className="text-slate-600 mt-1">
                Get a clear direction instead of randomly preparing.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                📚 Track your preparation
              </h4>
              <p className="text-slate-600 mt-1">
                Keep track of your DSA, skills, and interview preparation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                🚀 Prepare with confidence
              </h4>
              <p className="text-slate-600 mt-1">
                Understand your progress and become placement-ready.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default About;