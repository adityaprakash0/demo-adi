import { useEffect, useState } from 'react';
import {
  deleteAdminDonor,
  deleteAdminUser,
  getAdminDonors,
  getAdminOverview,
  getAdminUsers,
  updateAdminDonorAvailability,
  updateAdminUserRole,
} from '../api/admin.js';
import { updateRequestStatus } from '../api/requests.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StatCard from '../components/StatCard.jsx';
import { formatDate } from '../utils/formatters.js';

const AdminPanelPage = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [overviewData, usersData, donorsData] = await Promise.all([
        getAdminOverview(),
        getAdminUsers(),
        getAdminDonors(),
      ]);
      setOverview(overviewData);
      setUsers(usersData);
      setDonors(donorsData);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUserRoleChange = async (userId, role) => {
    try {
      await updateAdminUserRole(userId, role);
      await loadAdminData();
    } catch (updateError) {
      setError(updateError.response?.data?.message || 'Unable to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and related donor/request data?')) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      await loadAdminData();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete user.');
    }
  };

  const handleDonorAvailability = async (donorId, availability) => {
    try {
      await updateAdminDonorAvailability(donorId, availability);
      await loadAdminData();
    } catch (updateError) {
      setError(updateError.response?.data?.message || 'Unable to update donor availability.');
    }
  };

  const handleDeleteDonor = async (donorId) => {
    if (!window.confirm('Delete this donor profile?')) {
      return;
    }

    try {
      await deleteAdminDonor(donorId);
      await loadAdminData();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete donor.');
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, status);
      await loadAdminData();
    } catch (updateError) {
      setError(updateError.response?.data?.message || 'Unable to update request status.');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading admin panel..." />;
  }

  return (
    <section className="section-shell py-14">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Admin Panel</p>
        <h1 className="mt-3 font-display text-4xl text-slate-900">Manage users, donors, and requests</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Review platform activity, update roles, pause donor visibility, and close requests from a central dashboard.
        </p>
      </div>

      {error && <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-medical-700">{error}</p>}

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <StatCard label="Users" value={overview?.stats.users || 0} />
        <StatCard label="Donors" value={overview?.stats.donors || 0} accent="emerald" />
        <StatCard label="Open Requests" value={overview?.stats.openRequests || 0} accent="amber" />
        <StatCard label="Total Requests" value={overview?.stats.totalRequests || 0} />
      </div>

      <div className="mt-10 grid gap-8">
        <div className="medical-card overflow-hidden">
          <div className="border-b border-rose-100 px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-rose-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-rose-100">
                    <td className="px-6 py-4 font-semibold text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        className="medical-input max-w-[160px]"
                        value={user.role}
                        onChange={(event) => handleUserRoleChange(user._id, event.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button type="button" className="medical-button-secondary" onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="medical-card overflow-hidden">
          <div className="border-b border-rose-100 px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">Donors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-rose-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Donor</th>
                  <th className="px-6 py-4 font-semibold">Blood Group</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Availability</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor) => (
                  <tr key={donor._id} className="border-t border-rose-100">
                    <td className="px-6 py-4 font-semibold text-slate-900">{donor.user?.name}</td>
                    <td className="px-6 py-4 text-slate-600">{donor.bloodGroup}</td>
                    <td className="px-6 py-4 text-slate-600">{donor.location}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className={donor.availability ? 'medical-button-secondary' : 'medical-button'}
                        onClick={() => handleDonorAvailability(donor._id, !donor.availability)}
                      >
                        {donor.availability ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button type="button" className="medical-button-secondary" onClick={() => handleDeleteDonor(donor._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="medical-card p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-medical-700">Recent Requests</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Request monitoring</h2>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {overview?.recentRequests?.length ? (
              overview.recentRequests.map((request) => (
                <div key={request._id} className="rounded-3xl border border-rose-100 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{request.patientName}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {request.hospitalName} | {request.location}
                      </p>
                    </div>
                    <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-medical-700">
                      {request.bloodGroup} | {request.status}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-900">Requester:</span> {request.requester?.name || 'Unknown'}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Contact:</span> {request.contactNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Urgency:</span> {request.urgency}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Created:</span> {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <div className="mt-5">
                    <select
                      className="medical-input max-w-[220px]"
                      value={request.status}
                      onChange={(event) => handleRequestStatus(request._id, event.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Matched">Matched</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-rose-200 p-6 text-sm text-slate-500">
                No requests have been created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanelPage;
