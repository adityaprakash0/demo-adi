import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiErrorMessage } from '../utils/apiErrors.js';

const SignupPage = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
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

    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/dashboard');
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to create account right now.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-shell py-16">
      <div className="mx-auto max-w-2xl medical-card p-8 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.32em] text-medical-700">Join the network</p>
        <h1 className="mt-4 font-display text-4xl text-slate-900">Create your account</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Sign up to register as a donor, raise emergency requests, and manage activity from a secure dashboard.
        </p>

        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              className="medical-input"
              placeholder="Aarav Sharma"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="medical-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              className="medical-input"
              placeholder="9876543210"
              value={form.phone}
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
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="medical-input"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-medical-700 sm:col-span-2">
              {error}
            </p>
          )}

          <div className="sm:col-span-2">
            <button type="submit" className="medical-button w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-medical-700">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;
