function Features() {
  const features = [
    {
      title: "Personalized Roadmap",
      description:
        "Get a structured career roadmap based on your skills, goals, and placement target.",
      icon: "🎯",
    },
    {
      title: "DSA Progress Tracking",
      description:
        "Track your DSA practice and stay consistent with your problem-solving journey.",
      icon: "💻",
    },
    {
      title: "AI Interview Preparation",
      description:
        "Prepare for technical and HR interviews with AI-powered practice and feedback.",
      icon: "🤖",
    },
    {
      title: "Skill Gap Analysis",
      description:
        "Identify the skills you need to improve for your target roles and companies.",
      icon: "📊",
    },
    {
      title: "Career Guidance",
      description:
        "Get intelligent recommendations to help you make better career decisions.",
      icon: "🚀",
    },
    {
      title: "Placement Readiness",
      description:
        "Monitor your overall preparation and understand how ready you are for placements.",
      icon: "📈",
    },
  ];

  return (
    <section id="features" className="px-8 py-24">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <p className="text-green-600 font-semibold text-lg">
            Everything You Need
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
            Prepare Smarter.
            <span className="text-green-600"> Get Ahead.</span>
          </h2>

          <p className="text-slate-600 mt-5 max-w-2xl mx-auto text-lg">
            CareerPilot AI brings everything you need for your placement
            preparation into one intelligent platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition"
            >
              <div className="text-3xl mb-5">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;