import { useEffect, useState } from 'react';
import { searchDonors } from '../api/donors.js';
import DonorCard from '../components/DonorCard.jsx';
import GooglePlacesInput from '../components/GooglePlacesInput.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { bloodGroups } from '../utils/bloodGroups.js';

const SearchPage = () => {
  const [filters, setFilters] = useState({ bloodGroup: '', location: '' });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAllAvailable = async () => {
      try {
        setLoading(true);
        const data = await searchDonors({});
        setDonors(data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Unable to search donors right now.');
      } finally {
        setLoading(false);
      }
    };

    loadAllAvailable();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      const data = await searchDonors(filters);
      setDonors(data);
      setHasSearched(true);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Unable to search donors right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-shell py-14">
      <div className="medical-card p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Donor Search</p>
            <h1 className="mt-3 font-display text-4xl text-slate-900">Search by blood group and location</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              Find currently available donors and open their profile for contact details and request flow.
            </p>
          </div>
          <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-medical-700">
            {donors.length} donor{donors.length === 1 ? '' : 's'} available
          </div>
        </div>

        <form className="mt-8 grid gap-4 md:grid-cols-[220px_1fr_180px]" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="bloodGroup">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              className="medical-input"
              value={filters.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Any group</option>
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
              placeholder="Search by city or area"
              value={filters.location}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="medical-button mt-7 h-[50px]">
            Search
          </button>
        </form>

        {error && <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-medical-700">{error}</p>}
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingSpinner label="Searching available donors..." />
        ) : donors.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {donors.map((donor) => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        ) : (
          <div className="medical-card p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">No donors found</h2>
            <p className="mt-3 text-slate-500">
              {hasSearched
                ? 'Try a nearby location or a broader blood group search.'
                : 'There are no available donor profiles yet.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
