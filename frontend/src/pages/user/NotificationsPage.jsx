import React from 'react';
import { FiBell, FiCheck, FiTrash2, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/helpers';

const NotificationsPage = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
          <FiBell />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading">Notifications</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Emergency alerts, safety updates, and system announcements.</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-2 text-slate-400">
            <FiBell className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-semibold">No notifications found</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`glass-card p-5 rounded-2xl flex items-start justify-between gap-4 transition ${
                !item.isRead ? 'border-l-4 border-l-pink-600 bg-pink-500/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl text-xl ${
                  item.type === 'SOS' ? 'bg-red-500/20 text-red-500' : 'bg-pink-500/10 text-pink-500'
                }`}>
                  {item.type === 'SOS' ? <FiAlertTriangle /> : <FiInfo />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.title}</h4>
                    {!item.isRead && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-600 text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-400 block">{formatDate(item.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-pink-600 text-sm"
                    title="Mark Read"
                  >
                    <FiCheck />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm"
                  title="Delete Notification"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
