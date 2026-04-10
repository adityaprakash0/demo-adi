import { Link } from 'react-router-dom';

const DonorCard = ({ donor }) => {
  const initials = donor.user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="medical-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-lg font-extrabold text-medical-700">
            {initials || 'DN'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{donor.user?.name}</h3>
            <p className="text-sm text-slate-500">{donor.location}</p>
          </div>
        </div>
        <span className="rounded-full bg-medical-600 px-3 py-1 text-sm font-bold text-white">{donor.bloodGroup}</span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-900">Phone:</span> {donor.phone}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Age:</span> {donor.age}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Units:</span> {donor.unitsAvailable}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Status:</span>{' '}
          {donor.availability ? 'Available now' : 'Currently unavailable'}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to={`/donors/${donor._id}`} className="medical-button">
          View Profile
        </Link>
        <Link
          to={`/request?bloodGroup=${encodeURIComponent(donor.bloodGroup)}&location=${encodeURIComponent(donor.location)}`}
          className="medical-button-secondary"
        >
          Create Request
        </Link>
      </div>
    </article>
  );
};

export default DonorCard;

