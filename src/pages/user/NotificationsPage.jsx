import React from 'react';
import { FiBell, FiCheck, FiTrash2, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/helpers';

const NotificationsPage = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-card-xl p-6 sm:p-8 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-rose-600/30">
            <FiBell />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-zinc-900 dark:text-white">
                {isBn ? 'নোটিফিকেশন ও বার্তা' : 'Notifications'}
              </h1>
              <span className="mono-tag mono-tag-rose text-[10px]">
                {isBn ? 'রিয়েল-টাইম টেলিমেট্রি' : 'REAL-TIME TELEMETRY'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isBn ? 'জরুরি অ্যালার্ট, নিরাপত্তা আপডেট এবং সিস্টেম ঘোষণাসমূহ।' : 'Emergency alerts, safety updates, and system announcements.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 relative z-10">
        {notifications.length === 0 ? (
          <div className="glass-card-xl p-12 rounded-3xl text-center space-y-3 text-zinc-400">
            <FiBell className="w-12 h-12 mx-auto opacity-30 text-rose-500" />
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              {isBn ? 'কোনো নোটিফিকেশন নেই' : 'No Notifications Found'}
            </p>
            <p className="text-xs text-zinc-500">
              {isBn ? 'আপনি সকল নিরাপত্তা তথ্যের সাথে আপ-টু-ডেট আছেন।' : "You're completely up to date with all safety advisories."}
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`glass-card-xl p-5 sm:p-6 rounded-2xl flex items-start justify-between gap-4 transition-all duration-200 ${
                !item.isRead ? 'border-l-4 border-l-rose-600 bg-rose-500/5 dark:bg-rose-950/10' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl text-xl flex-shrink-0 ${
                  item.type === 'SOS' ? 'bg-rose-500/20 text-rose-500' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {item.type === 'SOS' ? <FiAlertTriangle /> : <FiInfo />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{item.title}</h4>
                    {!item.isRead && (
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                        {isBn ? 'নতুন' : 'New'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono pt-1">
                    {formatDate(item.createdAt || item.timestamp)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition"
                    title={isBn ? 'পঠিত হিসেবে চিহ্নিত করুন' : 'Mark as Read'}
                  >
                    <FiCheck />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                  title={isBn ? 'মুছে ফেলুন' : 'Delete'}
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
