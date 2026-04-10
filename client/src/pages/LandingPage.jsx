import { Link } from 'react-router-dom';

const featureCards = [
  {
    title: 'Instant donor search',
    description: 'Filter by blood group and city to find available donors in urgent situations.',
  },
  {
    title: 'Live emergency requests',
    description: 'Raise blood requests with urgency, hospital details, and contact information.',
  },
  {
    title: 'Admin coordination',
    description: 'Manage registered users, donors, and request activity from a central panel.',
  },
];

const LandingPage = () => (
  <div className="pb-20">
    <section className="section-shell py-16 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-medical-700">
            Emergency Response Platform
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-slate-900 sm:text-6xl">
            Find blood donors faster when every minute matters.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Emergency Blood Finder connects patients, families, hospitals, and volunteer donors through a simple
            full-stack workflow built for speed, clarity, and urgent action.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/search" className="medical-button px-8 py-4 text-base">
              Find Blood Now
            </Link>
            <Link to="/signup" className="medical-button-secondary px-8 py-4 text-base">
              Become a Donor
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="medical-card p-5">
              <p className="text-3xl font-extrabold text-medical-700">24/7</p>
              <p className="mt-2 text-sm text-slate-500">Emergency request access</p>
            </div>
            <div className="medical-card p-5">
              <p className="text-3xl font-extrabold text-medical-700">8</p>
              <p className="mt-2 text-sm text-slate-500">Supported blood groups</p>
            </div>
            <div className="medical-card p-5">
              <p className="text-3xl font-extrabold text-medical-700">1</p>
              <p className="mt-2 text-sm text-slate-500">Unified donor management dashboard</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-rose-200/60 blur-3xl" />
          <div className="absolute -right-6 bottom-8 h-40 w-40 rounded-full bg-red-300/40 blur-3xl" />

          <div className="medical-card relative overflow-hidden p-8 shadow-glow">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-rose-100 to-transparent" />
            <div className="relative">
              <div className="inline-flex rounded-3xl bg-medical-600 px-4 py-2 text-sm font-bold text-white">
                Live triage dashboard
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-rose-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-rose-400">Priority Match</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">O- donors near Kolkata</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-center shadow">
                      <p className="text-xs font-semibold text-slate-400">Available</p>
                      <p className="text-2xl font-extrabold text-medical-700">18</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-rose-100 p-5">
                    <p className="text-sm font-semibold text-slate-500">Urgent requests</p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900">42</p>
                  </div>
                  <div className="rounded-3xl border border-rose-100 p-5">
                    <p className="text-sm font-semibold text-slate-500">Donor availability</p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900">Live</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-900 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-300">Response workflow</p>
                  <p className="mt-3 text-lg font-semibold">Search, contact, and request blood from one place.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section-shell py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {featureCards.map((feature) => (
          <article key={feature.title} className="medical-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">{feature.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section-shell pt-12">
      <div className="medical-card overflow-hidden bg-gradient-to-r from-medical-700 to-red-500 p-8 text-white sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-100">Mission</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight">
          A cleaner digital flow for hospitals, volunteers, and families during emergencies.
        </h2>
        <p className="mt-5 max-w-3xl text-rose-50/90">
          The platform keeps authentication, donor registration, blood request creation, and admin monitoring inside
          one unified system so teams can move quickly under pressure.
        </p>
      </div>
    </section>
  </div>
);

export default LandingPage;

