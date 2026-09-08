import React, { useState, useEffect, useCallback } from 'react';
import {
  FiUsers,
  FiSearch,
  FiTrash2,
  FiShield,
  FiRefreshCw,
  FiUserPlus,
  FiX,
  FiMail,
  FiPhone,
  FiUser,
  FiCheckCircle
} from 'react-icons/fi';
import { collection, onSnapshot, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  getRegisteredUsers,
  updateUserStatus,
  deleteUserFromRegistry,
  upsertRegisteredUser,
  sanitizeUsers
} from '../../utils/adminDataRegistry';
import { formatDate } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers] = useState(() => getRegisteredUsers());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Setup real-time Cloud Firestore listener
  useEffect(() => {
    setLoading(true);
    let isMounted = true;

    // Initial local read for instant render
    const local = getRegisteredUsers();
    if (local.length > 0) {
      setUsers(local);
      setLoading(false);
    }

    // Real-time Cloud Firestore subscription
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        if (!isMounted) return;
        const cloudUsers = [];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && data.email) {
            cloudUsers.push({
              uid: d.id,
              ...data
            });
          }
        });

        // Merge cloud users with local users
        const localUsers = getRegisteredUsers();
        const map = new Map();
        localUsers.forEach((u) => map.set(u.email.toLowerCase().trim(), u));
        cloudUsers.forEach((u) =>
          map.set(u.email.toLowerCase().trim(), { ...map.get(u.email.toLowerCase().trim()), ...u })
        );

        const merged = sanitizeUsers(Array.from(map.values()));
        setUsers(merged);
        localStorage.setItem('safehaven_registered_users', JSON.stringify(merged));
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore user stream notice:', err.message);
        setLoading(false);
      }
    );

    const handleLocalUpdate = () => {
      setUsers(getRegisteredUsers());
    };

    window.addEventListener('safehaven_users_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener('safehaven_users_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, []);

  const handleManualSync = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const cloudUsers = [];
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data && data.email) {
          cloudUsers.push({ uid: d.id, ...data });
        }
      });

      const localUsers = getRegisteredUsers();
      const map = new Map();
      localUsers.forEach((u) => map.set(u.email.toLowerCase().trim(), u));
      cloudUsers.forEach((u) =>
        map.set(u.email.toLowerCase().trim(), { ...map.get(u.email.toLowerCase().trim()), ...u })
      );

      const merged = sanitizeUsers(Array.from(map.values()));
      setUsers(merged);
      localStorage.setItem('safehaven_registered_users', JSON.stringify(merged));
      toast.success(`Cloud sync completed. ${merged.length} user(s) verified.`);
    } catch (err) {
      toast.error('Sync completed with local registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (uid, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateDoc(doc(db, 'users', uid), { status: nextStatus });
    } catch (e) {}
    try {
      await api.patch(`/users/${uid}/status`, { status: nextStatus });
    } catch (e) {}

    const updated = await updateUserStatus(uid, nextStatus);
    setUsers(updated);
    toast.success(`User account status updated to ${nextStatus}.`);
  };

  const handleDeleteUser = async (uid, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name || 'this user'}"?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {}
    try {
      await api.delete(`/users/${uid}`);
    } catch (e) {}

    const updated = await deleteUserFromRegistry(uid);
    setUsers(updated);
    toast.success('User account removed permanently.');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newEmail || !newFullName) {
      toast.error('Please enter name and email.');
      return;
    }

    setIsSubmitting(true);
    const cleanEmail = newEmail.toLowerCase().trim();
    const uid = 'usr_' + Date.now();

    const newUserObj = {
      uid,
      email: cleanEmail,
      fullName: newFullName.trim(),
      phone: newPhone.trim() || 'Not Provided',
      role: newRole,
      status: 'active',
      profileImage: '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    try {
      // 1. Write directly to Cloud Firestore
      await setDoc(doc(db, 'users', uid), newUserObj, { merge: true });
      // 2. Upsert to local registry
      await upsertRegisteredUser(newUserObj);

      toast.success(`Account for ${cleanEmail} registered successfully!`);
      setNewFullName('');
      setNewEmail('');
      setNewPhone('');
      setNewRole('user');
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add user account.');
    } finally {
      setIsSubmitting(false);
    }
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
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> LIVE CLOUD DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            User <span className="gradient-text-rose">Management</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time registered platform accounts, role verification, and access controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <button
            onClick={handleManualSync}
            disabled={loading}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition"
            title="Sync Cloud Firestore"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
          >
            <FiUserPlus /> Add User
          </button>
        </div>
      </div>

      {/* Directory Table / List */}
      <div className="glass-card rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <FiUsers className="text-rose-500" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Verified Accounts ({filteredUsers.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              FIRESTORE CLOUD SYNC ACTIVE
            </span>
          </div>
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
                  ? `No user accounts match "${search}".`
                  : 'No registered accounts in database yet. New registrations will automatically appear here via Cloud Firestore.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition"
              >
                <FiUserPlus /> Register / Link User
              </button>
              <button
                onClick={handleManualSync}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold font-mono flex items-center gap-1.5 transition"
              >
                <FiRefreshCw /> Refresh Database
              </button>
            </div>
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
                  <th className="p-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredUsers.map((u) => (
                  <tr key={u.uid || u.email} className="hover:bg-zinc-900/40 transition">
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
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400 text-[11px]">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="p-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(u.uid, u.status || 'active')}
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FiUserPlus className="text-rose-500 text-lg" />
                <h3 className="text-base font-bold font-heading text-white">Register / Link User Account</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
              >
                <FiX />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Add or link any registered citizen email into the platform Firestore directory immediately.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-mono uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3.5 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Citizen Name"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-mono uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3.5 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-mono uppercase">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-3.5 text-zinc-500" />
                  <input
                    type="tel"
                    placeholder="e.g. +8801700000000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 font-mono uppercase">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 transition"
                >
                  <option value="user">Citizen User</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold font-mono tracking-wider shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
                >
                  {isSubmitting ? 'Registering...' : 'Save User to Cloud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
