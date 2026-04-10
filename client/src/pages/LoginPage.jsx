import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiErrorMessage } from '../utils/apiErrors.js';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to login right now.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-shell py-16">
      <div className="mx-auto max-w-lg medical-card p-8 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.32em] text-medical-700">Welcome back</p>
        <h1 className="mt-4 font-display text-4xl text-slate-900">Login to continue</h1>
        <p className="mt-3 text-slate-500">Access your donor dashboard, emergency requests, and admin tools.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="medical-input"
              placeholder="doctor@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="medical-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-medical-700">{error}</p>}

          <button type="submit" className="medical-button w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-medical-700">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
