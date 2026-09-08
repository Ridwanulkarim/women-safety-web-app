import React, { useState, useEffect, useCallback } from 'react';
import { FiUsers, FiSearch, FiTrash2, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  getRegisteredUsers,
  updateUserStatus,
  deleteUserFromRegistry,
  upsertRegisteredUser
} from '../../utils/adminDataRegistry';
import { formatDate } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers] = useState(() => getRegisteredUsers());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const syncUsers = useCallback(async () => {
    // 1. Instant local read
    const local = getRegisteredUsers();
    setUsers(local);

    // 2. Background API sync if available
    try {
      setLoading(true);
      const res = await api.get('/users');
      if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
        res.data.data.forEach((u) => upsertRegisteredUser(u));
        setUsers(getRegisteredUsers());
      }
    } catch (e) {
      // Backend not running or offline, local registry remains primary source of truth
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncUsers();

    const handleUpdate = () => {
      setUsers(getRegisteredUsers());
    };

    window.addEventListener('safehaven_users_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('safehaven_users_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [syncUsers]);

  const handleToggleStatus = async (uid, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/users/${uid}/status`, { status: nextStatus });
    } catch (e) {}
    const updated = updateUserStatus(uid, nextStatus);
    setUsers(updated);
    toast.success(`User status updated to ${nextStatus}.`);
  };

  const handleDeleteUser = async (uid, name) => {
    if (!window.confirm(`Are you sure you want to remove user "${name || 'this user'}"?`)) {
      return;
    }
    try {
      await api.delete(`/users/${uid}`);
    } catch (e) {}
    const updated = deleteUserFromRegistry(uid);
    setUsers(updated);
    toast.success('User account removed.');
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="mono-tag mono-tag-rose text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> IDENTITY DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            User <span className="gradient-text-rose">Management</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time registered platform accounts, role verification, and access controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Directory Table / List */}
      <div className="glass-card rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <FiUsers className="text-rose-500" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Verified User Accounts ({filteredUsers.length})
            </h3>
          </div>
          {loading && (
            <span className="text-[10px] text-zinc-500 font-mono animate-pulse">
              Syncing directory...
            </span>
          )}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-2xl">
              <FiUsers />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-200">No Users Found</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                {search
                  ? `No user accounts match the search query "${search}".`
                  : 'No user accounts have registered yet. As real users register or sign in, they will automatically appear here.'}
              </p>
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-semibold transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800 text-[10px] font-mono">
                <tr>
                  <th className="p-4 sm:px-6">User / Identity</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registration Date</th>
                  <th className="p-4 text-right sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-zinc-900/40 transition">
                    <td className="p-4 sm:px-6 font-semibold text-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase flex-shrink-0">
                          {u.fullName?.charAt(0) || u.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-100">{u.fullName}</p>
                          <p className="text-[11px] text-zinc-400 font-normal font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-zinc-400">{u.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                          u.role === 'admin'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {u.role === 'admin' && <FiShield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                          u.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400 text-[11px]">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="p-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(u.uid, u.status)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase transition font-mono ${
                          u.status === 'active'
                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                        }`}
                        title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.uid, u.fullName)}
                        className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition inline-flex items-center justify-center"
                        title="Delete User"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
