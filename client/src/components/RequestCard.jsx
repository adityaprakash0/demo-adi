import { formatDate } from '../utils/formatters.js';

const urgencyClasses = {
  Normal: 'bg-sky-100 text-sky-700',
  Urgent: 'bg-amber-100 text-amber-700',
  Critical: 'bg-rose-100 text-medical-700',
};

const statusClasses = {
  Open: 'bg-emerald-100 text-emerald-700',
  Matched: 'bg-blue-100 text-blue-700',
  Closed: 'bg-slate-100 text-slate-700',
};

const RequestCard = ({ request, action }) => (
  <article className="medical-card p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-lg font-bold text-slate-900">{request.patientName}</h3>
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${urgencyClasses[request.urgency]}`}>
          {request.urgency}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[request.status]}`}>
          {request.status}
        </span>
      </div>
    </div>

    <div className="mt-4 grid gap-2 text-sm text-slate-600">
      <p>
        <span className="font-semibold text-slate-900">Blood Group:</span> {request.bloodGroup}
      </p>
      <p>
        <span className="font-semibold text-slate-900">Hospital:</span> {request.hospitalName}
      </p>
      <p>
        <span className="font-semibold text-slate-900">Location:</span> {request.location}
      </p>
      <p>
        <span className="font-semibold text-slate-900">Units Needed:</span> {request.unitsNeeded}
      </p>
      <p>
        <span className="font-semibold text-slate-900">Contact:</span> {request.contactNumber}
      </p>
      <p>
        <span className="font-semibold text-slate-900">Required By:</span> {formatDate(request.requiredBy)}
      </p>
      {request.message && (
        <p>
          <span className="font-semibold text-slate-900">Message:</span> {request.message}
        </p>
      )}
    </div>

    {action ? <div className="mt-5">{action}</div> : null}
  </article>
);

export default RequestCard;
