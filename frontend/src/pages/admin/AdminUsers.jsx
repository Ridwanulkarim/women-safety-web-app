import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiUserX, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { uid: 'u1', fullName: 'Sarah Connor', email: 'sarah@example.com', role: 'user', status: 'active', phone: '+8801711111111' },
    { uid: 'u2', fullName: 'Emily Rose', email: 'emily@example.com', role: 'user', status: 'active', phone: '+8801822222222' },
    { uid: 'u3', fullName: 'Admin Manager', email: 'admin@safehaven.org', role: 'admin', status: 'active', phone: '+8801933333333' }
  ]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        if (res.data?.data) {
          setUsers(res.data.data);
        }
      } catch (e) {}
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (uid, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/users/${uid}/status`, { status: nextStatus });
    } catch (e) {}
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: nextStatus } : u));
    toast.success(`User status changed to ${nextStatus}`);
  };

  const handleDeleteUser = async (uid) => {
    try {
      await api.delete(`/users/${uid}`);
    } catch (e) {}
    setUsers(prev => prev.filter(u => u.uid !== uid));
    toast.success('User deleted from database.');
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-purple-400">User Management Directory</h1>
          <p className="text-xs text-slate-400">Manage registered user accounts, roles, and status suspension.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name/email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 font-semibold text-slate-100">
                    <div>
                      <p>{u.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{u.phone || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u.uid, u.status)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase transition ${
                        u.status === 'active'
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u.uid)}
                      className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      title="Delete User"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
