import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDonorById } from '../api/donors.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate } from '../utils/formatters.js';

const DonorProfilePage = () => {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDonor = async () => {
      try {
        setLoading(true);
        const data = await getDonorById(id);
        setDonor(data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Unable to load donor profile.');
      } finally {
        setLoading(false);
      }
    };

    loadDonor();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading donor profile..." />;
  }

  if (error || !donor) {
    return (
      <section className="section-shell py-16">
        <div className="medical-card p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Donor unavailable</h1>
          <p className="mt-4 text-slate-500">{error || 'The requested donor profile could not be found.'}</p>
          <Link to="/search" className="medical-button mt-6">
            Back to Search
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="medical-card p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-medical-700">Donor Profile</p>
              <h1 className="mt-3 font-display text-4xl text-slate-900">{donor.user?.name}</h1>
              <p className="mt-2 text-slate-500">{donor.location}</p>
            </div>
            <span className="rounded-full bg-medical-600 px-4 py-2 text-lg font-extrabold text-white">
              {donor.bloodGroup}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-rose-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Availability</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {donor.availability ? 'Available now' : 'Temporarily unavailable'}
              </p>
            </div>
            <div className="rounded-3xl bg-rose-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Units Available</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{donor.unitsAvailable}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">Contact Number:</span> {donor.phone}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Email:</span> {donor.user?.email}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Age:</span> {donor.age}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Last Donated:</span> {formatDate(donor.lastDonated)}
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-rose-100 p-6">
            <h2 className="text-xl font-bold text-slate-900">About this donor</h2>
            <p className="mt-3 leading-7 text-slate-600">{donor.about || 'No additional notes provided yet.'}</p>
          </div>
        </div>

        <div className="medical-card p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Quick Actions</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Need blood immediately?</h2>
          <p className="mt-4 leading-7 text-slate-500">
            Use the emergency request page to submit patient details, hospital information, urgency level, and contact
            number so responders can coordinate quickly.
          </p>

          <div className="mt-8 grid gap-4">
            <Link
              to={`/request?bloodGroup=${encodeURIComponent(donor.bloodGroup)}&location=${encodeURIComponent(donor.location)}`}
              className="medical-button"
            >
              Raise Emergency Request
            </Link>
            <Link to="/search" className="medical-button-secondary">
              Search More Donors
            </Link>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-900 p-6 text-white">
            <p className="text-sm font-semibold text-rose-200">Medical tip</p>
            <p className="mt-3 text-lg font-semibold">
              Always verify donor eligibility and hospital requirements before scheduling a donation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonorProfilePage;

