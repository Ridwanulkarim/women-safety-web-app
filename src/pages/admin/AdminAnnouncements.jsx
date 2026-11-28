import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiRadio, FiSend, FiTrash2, FiClock } from 'react-icons/fi';
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
    toast.success('Security advisory published');
    reset();
  };

  const handleDelete = (id) => {
    const updated = deleteAdminAnnouncement(id);
    setAnnouncements(updated);
    toast.success('Announcement deleted');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">Emergency broadcast</span>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          System announcements
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
          Publish platform security advisories, severe weather warnings, and safety notices
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="surface-panel p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3">
          <FiRadio className="w-4 h-4 text-[#e11d48] dispatch-icon" />
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">New advisory broadcast</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="human-label">Advisory title</label>
            <input
              type="text"
              required
              placeholder="Extreme monsoon advisory"
              {...register('title')}
              className="human-input"
            />
          </div>

          <div>
            <label className="human-label">Priority level</label>
            <select {...register('priority')} className="human-input">
              <option value="normal">Standard notice</option>
              <option value="high">High priority</option>
              <option value="critical">Critical alert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="human-label">Message body</label>
          <textarea
            rows="3"
            required
            placeholder="Write the advisory notice or operational update"
            {...register('content')}
            className="human-input"
          ></textarea>
        </div>

        <button type="submit" className="btn-solid h-10 px-5 text-xs">
          <FiSend className="w-4 h-4 dispatch-icon" /> Publish advisory
        </button>
      </form>

      {/* Published History */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
          Published advisories ({announcements.length})
        </h2>

        {announcements.length === 0 ? (
          <div className="surface-panel p-10 text-center space-y-2">
            <FiRadio className="w-6 h-6 mx-auto text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">No broadcasts active</p>
            <p className="text-xs text-[#737373] dark:text-[#85858b]">
              Use the form above to publish a platform safety advisory.
            </p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className="surface-card p-5 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`status-tag ${
                      ann.priority === 'critical' ? 'mono-tag-rose' : ''
                    }`}
                  >
                    {ann.priority ? ann.priority.charAt(0).toUpperCase() + ann.priority.slice(1) : 'Normal'}
                  </span>
                  <h3 className="font-medium text-sm text-[#171717] dark:text-[#ededed]">{ann.title}</h3>
                </div>
                <p className="text-xs text-[#525252] dark:text-[#a1a1a6] leading-relaxed">{ann.content}</p>
                <span className="text-xs text-[#737373] dark:text-[#85858b] font-mono tabular-nums flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5 dispatch-icon" /> {formatDate(ann.createdAt)}
                </span>
              </div>

              <button
                onClick={() => handleDelete(ann.id)}
                className="h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] border border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Remove broadcast"
              >
                <FiTrash2 className="w-3.5 h-3.5 dispatch-icon" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
