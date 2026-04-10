import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="section-shell py-20">
    <div className="mx-auto max-w-2xl medical-card p-10 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">404</p>
      <h1 className="mt-4 font-display text-5xl text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-500">The page you requested does not exist or may have been moved.</p>
      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <Link to="/" className="medical-button">
          Go Home
        </Link>
        <Link to="/search" className="medical-button-secondary">
          Search Donors
        </Link>
      </div>
    </div>
  </section>
);

export default NotFoundPage;
