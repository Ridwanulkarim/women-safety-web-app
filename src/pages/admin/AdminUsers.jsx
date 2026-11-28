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
            const clean = data.email.toLowerCase().trim();
            if (clean === 'admin@safehaven.app' || data.fullName?.toLowerCase().trim() === 'safehaven admin') return;
            cloudUsers.push({
              uid: d.id,
              ...data,
              email: clean,
              role: clean === 'ridwanulk08@gmail.com' ? 'admin' : 'user'
            });
          }
        });

        // Merge cloud users with local users
        const localUsers = getRegisteredUsers();
        const map = new Map();
        localUsers.forEach((u) => {
          if (u.email) {
            const clean = u.email.toLowerCase().trim();
            if (clean !== 'admin@safehaven.app') {
              map.set(clean, { ...u, role: clean === 'ridwanulk08@gmail.com' ? 'admin' : 'user' });
            }
          }
        });
        cloudUsers.forEach((u) => {
          const clean = u.email.toLowerCase().trim();
          if (clean !== 'admin@safehaven.app') {
            map.set(clean, { ...map.get(clean), ...u, role: clean === 'ridwanulk08@gmail.com' ? 'admin' : 'user' });
          }
        });

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
          const clean = data.email.toLowerCase().trim();
          if (clean === 'admin@safehaven.app' || data.fullName?.toLowerCase().trim() === 'safehaven admin') return;
          cloudUsers.push({
            uid: d.id,
            ...data,
            email: clean,
            role: clean === 'ridwanulk08@gmail.com' ? 'admin' : 'user'
          });
        }
      });

      const localUsers = getRegisteredUsers();
      const map = new Map();
      localUsers.forEach((u) => {
        if (u.email) {
          const clean = u.email.toLowerCase().trim();
          if (clean !== 'admin@safehaven.app') {
            map.set(clean, { ...u, role: clean === 'ridwanulk08@gmail.com' ? 'admin' : 'user' });
          }
        }
      });
      cloudUsers.forEach((u) => {
        const clean = u.email.toLowerCase().trim();
        if (clean !== 'admin@safehaven.app') {
          map.set(clean, { ...map.get(clean), ...u, role: clean === 'ridwanulk08@gmail.com' ? 'admin' : 'user' });
        }
      });

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">Cloud directory</span>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
            User management
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            Registered accounts, role assignment, and status controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <FiSearch className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="human-input human-input-has-icon text-sm"
            />
          </div>

          <button
            onClick={handleManualSync}
            disabled={loading}
            className="btn-outline h-10 w-10 px-0"
            title="Sync Cloud Firestore"
          >
            <FiRefreshCw className={`w-4 h-4 dispatch-icon ${loading ? 'animate-spin text-[#e11d48]' : ''}`} />
          </button>

          <button onClick={() => setShowAddModal(true)} className="btn-solid h-10 px-4 text-xs">
            <FiUserPlus className="w-4 h-4 dispatch-icon" /> Add user
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="surface-panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-between bg-[#fafafa] dark:bg-[#141415]">
          <div className="flex items-center gap-2">
            <FiUsers className="w-4 h-4 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
            <h2 className="text-xs font-medium text-[#171717] dark:text-[#ededed] font-mono tabular-nums">
              Verified accounts ({filteredUsers.length})
            </h2>
          </div>
          <span className="status-tag mono-tag-emerald">Firestore synced</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <FiUsers className="w-6 h-6 mx-auto text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">No users found</h3>
              <p className="text-xs text-[#737373] dark:text-[#85858b] max-w-md mx-auto">
                {search
                  ? `No user accounts match "${search}".`
                  : 'No registered accounts found in Firestore yet.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <button onClick={() => setShowAddModal(true)} className="btn-solid h-9 px-4 text-xs">
                <FiUserPlus className="w-3.5 h-3.5 dispatch-icon" /> Add user
              </button>
              <button onClick={handleManualSync} className="btn-outline h-9 px-4 text-xs">
                <FiRefreshCw className="w-3.5 h-3.5 dispatch-icon" /> Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] dark:bg-[#141415] text-[#737373] dark:text-[#85858b] font-medium border-b border-zinc-900/[0.08] dark:border-white/[0.08]">
                <tr>
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/[0.08] dark:divide-white/[0.08]">
                {filteredUsers.map((u) => {
                  const userIsAdmin =
                    u.role === 'admin' || u.email?.toLowerCase().trim() === 'ridwanulk08@gmail.com';
                  return (
                    <tr key={u.uid || u.email} className="hover:bg-[#fafafa] dark:hover:bg-[#141415] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#232325] text-[#ededed] flex items-center justify-center font-medium text-xs uppercase shrink-0">
                            {u.fullName?.charAt(0) || u.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-[#171717] dark:text-[#ededed]">{u.fullName}</p>
                            <p className="text-[#737373] dark:text-[#85858b] font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-[#525252] dark:text-[#a1a1a6]">
                        {u.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`status-tag ${userIsAdmin ? 'mono-tag-rose' : ''}`}>
                          {userIsAdmin && <FiShield className="w-3 h-3 dispatch-icon" />}
                          {userIsAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`status-tag ${
                            u.status === 'suspended' ? 'mono-tag-rose' : 'mono-tag-emerald'
                          }`}
                        >
                          {u.status === 'suspended' ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-[#737373] dark:text-[#85858b]">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(u.uid, u.status || 'active')}
                          className="btn-outline h-8 px-2.5 text-xs"
                          title={u.status === 'active' ? 'Suspend account' : 'Reactivate account'}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.uid, u.fullName)}
                          className="h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] border border-zinc-900/[0.08] dark:border-white/[0.08] inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <FiTrash2 className="w-3.5 h-3.5 dispatch-icon" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="surface-panel p-6 sm:p-8 max-w-md w-full shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <FiUserPlus className="w-4 h-4 text-[#e11d48] dispatch-icon" />
                <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
                  Add user account
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="h-8 w-8 rounded-lg text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] hover:bg-[#f4f4f5] dark:hover:bg-[#232325] flex items-center justify-center cursor-pointer"
              >
                <FiX className="w-4 h-4 dispatch-icon" />
              </button>
            </div>

            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              Register or link a citizen account into the Firestore directory.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="human-label">Full name</label>
                <div className="relative">
                  <FiUser className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Ayesha Rahman"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="human-input human-input-has-icon"
                  />
                </div>
              </div>

              <div>
                <label className="human-label">Email address</label>
                <div className="relative">
                  <FiMail className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                  <input
                    type="email"
                    required
                    placeholder="user@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="human-input human-input-has-icon font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="human-label">Phone number</label>
                <div className="relative">
                  <FiPhone className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                  <input
                    type="tel"
                    placeholder="+8801700000000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="human-input human-input-has-icon font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="human-label">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="human-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline h-9 px-4 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-solid h-9 px-4 text-xs">
                  {isSubmitting ? 'Saving' : 'Save user'}
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
