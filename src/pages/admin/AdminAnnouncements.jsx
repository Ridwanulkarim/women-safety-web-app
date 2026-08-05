import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiRadio, FiSend, FiTrash2, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const AdminAnnouncements = () => {
  const { register, handleSubmit, reset } = useForm();
  const [announcements, setAnnouncements] = useState([
    { id: 'ann_1', title: 'System Safety Maintenance', content: 'Routine updates to Bangladesh GPS dispatch gateways completed.', priority: 'normal', createdAt: new Date().toISOString() }
  ]);

  const onSubmit = (data) => {
    const newAnn = {
      id: 'ann_' + Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    toast.success('Announcement broadcasted to all users!');
    reset();
  };

  const handleDelete = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast.success('Announcement removed.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-purple-400">System Announcement Broadcaster</h1>
        <p className="text-xs text-slate-400">Broadcast platform announcements and security advisories.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-800">
        <h3 className="text-lg font-bold font-heading">New Broadcast</h3>

        <div>
          <label className="block text-xs font-semibold mb-1">Announcement Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Extreme Weather Advisory"
            {...register('title')}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Announcement Content</label>
          <textarea
            rows="3"
            required
            placeholder="Write announcement details..."
            {...register('content')}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none focus:border-purple-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
        >
          <FiSend /> Broadcast Announcement
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-bold font-heading">Active Broadcasts</h3>
        {announcements.map((ann) => (
          <div key={ann.id} className="glass-card p-6 rounded-2xl flex items-start justify-between gap-4 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FiRadio className="text-purple-400" />
                <h4 className="font-bold text-slate-100">{ann.title}</h4>
              </div>
              <p className="text-xs text-slate-300">{ann.content}</p>
              <span className="text-[10px] text-slate-400 block"><FiClock className="inline" /> {formatDate(ann.createdAt)}</span>
            </div>

            <button
              onClick={() => handleDelete(ann.id)}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
