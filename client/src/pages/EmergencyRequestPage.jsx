import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createRequest, getOpenRequests } from '../api/requests.js';
import GooglePlacesInput from '../components/GooglePlacesInput.jsx';
import RequestCard from '../components/RequestCard.jsx';
import { bloodGroups, urgencyLevels } from '../utils/bloodGroups.js';

const EmergencyRequestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: searchParams.get('bloodGroup') || '',
    hospitalName: '',
    location: searchParams.get('location') || '',
    unitsNeeded: 1,
    urgency: 'Urgent',
    contactNumber: '',
    requiredBy: '',
    message: '',
  });
  const [openRequests, setOpenRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getOpenRequests();
        setOpenRequests(data.slice(0, 3));
      } catch {
        setOpenRequests([]);
      }
    };

    loadRequests();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.patientName || !form.bloodGroup || !form.hospitalName || !form.location || !form.contactNumber) {
      setError('Please fill the required patient, blood, hospital, location, and contact fields.');
      return;
    }

    try {
      setLoading(true);
      await createRequest({
        ...form,
        unitsNeeded: Number(form.unitsNeeded),
      });
      navigate('/dashboard');
    } catch (submitError) {
      const apiErrors = submitError.response?.data?.errors;
      setError(apiErrors?.[0]?.msg || submitError.response?.data?.message || 'Unable to create emergency request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-shell py-14">
      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="medical-card p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Emergency Request</p>
          <h1 className="mt-3 font-display text-4xl text-slate-900">Raise a blood request</h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Share the patient details, blood group, hospital, urgency, and contact number to help donors respond
            quickly.
          </p>

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="patientName">
                Patient Name
              </label>
              <input
                id="patientName"
                name="patientName"
                className="medical-input"
                value={form.patientName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="bloodGroup">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                className="medical-input"
                value={form.bloodGroup}
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

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="hospitalName">
                Hospital Name
              </label>
              <input
                id="hospitalName"
                name="hospitalName"
                className="medical-input"
                value={form.hospitalName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="location">
                Location
              </label>
              <GooglePlacesInput
                id="location"
                name="location"
                className="medical-input"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="unitsNeeded">
                Units Needed
              </label>
              <input
                id="unitsNeeded"
                name="unitsNeeded"
                type="number"
                min="1"
                max="10"
                className="medical-input"
                value={form.unitsNeeded}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="urgency">
                Urgency
              </label>
              <select
                id="urgency"
                name="urgency"
                className="medical-input"
                value={form.urgency}
                onChange={handleChange}
              >
                {urgencyLevels.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="contactNumber">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                className="medical-input"
                value={form.contactNumber}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="requiredBy">
                Required By
              </label>
              <input
                id="requiredBy"
                name="requiredBy"
                type="datetime-local"
                className="medical-input"
                value={form.requiredBy}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="message">
                Additional Details
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="medical-input"
                placeholder="Share ward details, replacement requirements, or hospital instructions."
                value={form.message}
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
                {loading ? 'Submitting request...' : 'Submit Emergency Request'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="medical-card p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Live Feed</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Open emergency cases</h2>
            <div className="mt-6 space-y-4">
              {openRequests.length > 0 ? (
                openRequests.map((request) => <RequestCard key={request._id} request={request} />)
              ) : (
                <div className="rounded-3xl border border-dashed border-rose-200 p-6 text-sm text-slate-500">
                  No open requests available right now.
                </div>
              )}
            </div>
          </div>

          <div className="medical-card p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Checklist</p>
            <ul className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <li>Confirm the exact blood group and number of units needed with the treating hospital.</li>
              <li>Keep one active contact number available for quick coordination.</li>
              <li>Use the dashboard after submission to track your request status.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyRequestPage;
