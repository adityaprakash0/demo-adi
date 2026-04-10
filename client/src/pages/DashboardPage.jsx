import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { saveDonorProfile } from '../api/donors.js';
import { getMyRequests, getOpenRequests } from '../api/requests.js';
import GooglePlacesInput from '../components/GooglePlacesInput.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import RequestCard from '../components/RequestCard.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { bloodGroups } from '../utils/bloodGroups.js';

const emptyDonorForm = {
  bloodGroup: '',
  location: '',
  phone: '',
  age: '',
  unitsAvailable: 1,
  availability: true,
  lastDonated: '',
  about: '',
};

const DashboardPage = () => {
  const { user, donorProfile, refreshProfile } = useAuth();
  const [donorForm, setDonorForm] = useState(emptyDonorForm);
  const [myRequests, setMyRequests] = useState([]);
  const [openRequests, setOpenRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (donorProfile) {
      setDonorForm({
        bloodGroup: donorProfile.bloodGroup || '',
        location: donorProfile.location || '',
        phone: donorProfile.phone || user?.phone || '',
        age: donorProfile.age || '',
        unitsAvailable: donorProfile.unitsAvailable || 1,
        availability: donorProfile.availability ?? true,
        lastDonated: donorProfile.lastDonated ? donorProfile.lastDonated.slice(0, 10) : '',
        about: donorProfile.about || '',
      });
    } else {
      setDonorForm((current) => ({
        ...current,
        phone: user?.phone || '',
      }));
    }
  }, [donorProfile, user]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [myRequestData, openRequestData] = await Promise.all([getMyRequests(), getOpenRequests()]);
        setMyRequests(myRequestData);
        setOpenRequests(openRequestData.slice(0, 3));
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Unable to load dashboard data right now.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDonorForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatusMessage('');

    if (!donorForm.bloodGroup || !donorForm.location || !donorForm.phone || !donorForm.age) {
      setError('Blood group, location, phone, and age are required for donor registration.');
      return;
    }

    try {
      setSaving(true);
      await saveDonorProfile({
        ...donorForm,
        age: Number(donorForm.age),
        unitsAvailable: Number(donorForm.unitsAvailable),
      });
      await refreshProfile();
      setStatusMessage('Donor profile saved successfully.');
    } catch (submitError) {
      const apiErrors = submitError.response?.data?.errors;
      setError(apiErrors?.[0]?.msg || submitError.response?.data?.message || 'Unable to save donor profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your dashboard..." />;
  }

  return (
    <section className="section-shell py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Dashboard</p>
          <h1 className="mt-3 font-display text-4xl text-slate-900">Welcome, {user?.name}</h1>
          <p className="mt-3 max-w-3xl text-slate-500">
            Keep your donor details updated, monitor your emergency requests, and respond faster when patients need
            blood.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/search" className="medical-button-secondary">
            Search Donors
          </Link>
          <Link to="/request" className="medical-button">
            New Emergency Request
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <StatCard label="My Requests" value={myRequests.length} />
        <StatCard label="Open Community Requests" value={openRequests.length} accent="amber" />
        <StatCard
          label="Donor Status"
          value={donorProfile?.availability ? 'Active' : donorProfile ? 'Paused' : 'New'}
          accent="emerald"
        />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="medical-card p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Donor Registration</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {donorProfile ? 'Update donor profile' : 'Register as a donor'}
              </h2>
            </div>
            <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-medical-700">
              {donorProfile ? 'Profile exists' : 'Not registered yet'}
            </div>
          </div>

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="bloodGroup">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                className="medical-input"
                value={donorForm.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="location">
                Location
              </label>
              <GooglePlacesInput
                id="location"
                name="location"
                className="medical-input"
                placeholder="Kolkata"
                value={donorForm.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phone">
                Contact Number
              </label>
              <input
                id="phone"
                name="phone"
                className="medical-input"
                placeholder="9876543210"
                value={donorForm.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="18"
                max="65"
                className="medical-input"
                value={donorForm.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="unitsAvailable">
                Units Available
              </label>
              <input
                id="unitsAvailable"
                name="unitsAvailable"
                type="number"
                min="1"
                max="5"
                className="medical-input"
                value={donorForm.unitsAvailable}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="lastDonated">
                Last Donated
              </label>
              <input
                id="lastDonated"
                name="lastDonated"
                type="date"
                className="medical-input"
                value={donorForm.lastDonated}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="about">
                Short Note
              </label>
              <textarea
                id="about"
                name="about"
                rows="4"
                className="medical-input"
                placeholder="Share availability notes, preferred donation timing, or nearby hospital access."
                value={donorForm.about}
                onChange={handleChange}
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 sm:col-span-2">
              <input
                type="checkbox"
                name="availability"
                checked={donorForm.availability}
                onChange={handleChange}
                className="h-4 w-4 rounded border-rose-300 text-medical-600 focus:ring-rose-200"
              />
              <span className="text-sm font-semibold text-slate-700">I am currently available for donation.</span>
            </label>

            {error && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-medical-700 sm:col-span-2">
                {error}
              </p>
            )}

            {statusMessage && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 sm:col-span-2">
                {statusMessage}
              </p>
            )}

            <div className="sm:col-span-2">
              <button type="submit" className="medical-button w-full" disabled={saving}>
                {saving ? 'Saving profile...' : donorProfile ? 'Update Donor Profile' : 'Register as Donor'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="medical-card p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">My Emergency Requests</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Track your cases</h2>
              </div>
              <Link to="/request" className="medical-button-secondary">
                New Request
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {myRequests.length > 0 ? (
                myRequests.slice(0, 3).map((request) => <RequestCard key={request._id} request={request} />)
              ) : (
                <div className="rounded-3xl border border-dashed border-rose-200 p-6 text-sm text-slate-500">
                  You have not created any emergency requests yet.
                </div>
              )}
            </div>
          </div>

          <div className="medical-card p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Community Alerts</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Open requests nearby</h2>
            <div className="mt-6 space-y-4">
              {openRequests.length > 0 ? (
                openRequests.map((request) => <RequestCard key={request._id} request={request} />)
              ) : (
                <div className="rounded-3xl border border-dashed border-rose-200 p-6 text-sm text-slate-500">
                  No open emergency requests at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
