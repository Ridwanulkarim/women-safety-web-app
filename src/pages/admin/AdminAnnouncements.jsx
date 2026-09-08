import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiRadio, FiSend, FiTrash2, FiClock, FiVolume2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import {
  getAdminAnnouncements,
  saveAdminAnnouncement,
  deleteAdminAnnouncement
} from '../../utils/adminDataRegistry';

const AdminAnnouncements = () => {
  const { register, handleSubmit, reset } = useForm();
  const [announcements, setAnnouncements] = useState(() => getAdminAnnouncements());

  useEffect(() => {
    setAnnouncements(getAdminAnnouncements());
  }, []);

  const onSubmit = (data) => {
    const updated = saveAdminAnnouncement({
      title: data.title,
      content: data.content,
      priority: data.priority || 'normal',
      createdAt: new Date().toISOString()
    });
    setAnnouncements(updated);
    toast.success('Security announcement broadcasted successfully!');
    reset();
  };

  const handleDelete = (id) => {
    const updated = deleteAdminAnnouncement(id);
    setAnnouncements(updated);
    toast.success('Announcement removed from system.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      <div>
        <div className="flex items-center gap-2">
          <span className="mono-tag mono-tag-rose text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> EMERGENCY BROADCAST
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
          System Announcement <span className="gradient-text-rose">Broadcaster</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Publish platform security advisories, severe weather notifications, and safety updates to all citizens.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-zinc-800 shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <FiVolume2 className="text-rose-500 text-lg" />
          <h3 className="text-base font-bold font-heading text-zinc-100">Create New Advisory Broadcast</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 font-mono uppercase">
            Advisory Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Extreme Monsoon Weather Advisory / Area Alert"
            {...register('title')}
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 font-mono uppercase">
              Priority Level
            </label>
            <select
              {...register('priority')}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 transition"
            >
              <option value="normal">Standard Notice (Normal)</option>
              <option value="high">High Priority (Security Alert)</option>
              <option value="critical">Critical (Immediate Evacuation / Danger)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 font-mono uppercase">
            Advisory Message Body
          </label>
          <textarea
            rows="3"
            required
            placeholder="Detail the safety advisory, guidance, or operational update..."
            {...register('content')}
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition"
        >
          <FiSend /> Broadcast Advisory Now
        </button>
      </form>

      {/* Published Broadcasts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiRadio className="text-rose-500" />
          <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wider">
            Published Advisory History ({announcements.length})
          </h3>
        </div>

        {announcements.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center space-y-2 border border-zinc-800 text-zinc-500">
            <FiRadio className="w-10 h-10 mx-auto opacity-30 text-rose-500" />
            <p className="text-xs font-bold text-zinc-400">No Broadcasts Active</p>
            <p className="text-[11px] text-zinc-500">
              No platform-wide advisories have been dispatched yet. Use the form above to post one.
            </p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="glass-card p-5 sm:p-6 rounded-2xl flex items-start justify-between gap-4 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                      ann.priority === 'critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : ann.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {ann.priority || 'NORMAL'}
                  </span>
                  <h4 className="font-bold text-sm text-zinc-100">{ann.title}</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{ann.content}</p>
                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                  <FiClock className="text-zinc-600" /> {formatDate(ann.createdAt)}
                </span>
              </div>

              <button
                onClick={() => handleDelete(ann.id)}
                className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700/50 transition flex-shrink-0"
                title="Remove Broadcast"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
