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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="surface-panel p-6 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] flex items-center justify-center shrink-0">
          <FiBell className="w-5 h-5 dispatch-icon" />
        </div>
        <div>
          <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'নোটিফিকেশন ও বার্তা' : 'Notifications'}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isBn ? 'জরুরি অ্যালার্ট, নিরাপত্তা আপডেট এবং সিস্টেম বার্তা' : 'Emergency alerts, safety advisories, and system messages'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="surface-panel p-12 text-center space-y-3">
            <FiBell className="w-6 h-6 mx-auto text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
            </p>
            <p className="text-xs text-[#737373] dark:text-[#85858b]">
              {isBn ? 'আপনার কোনো নতুন অ্যালার্ট বা ঘোষণা নেই।' : 'You are up to date with all safety advisories.'}
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`surface-card p-5 flex items-start justify-between gap-4 ${
                !item.isRead ? 'border-[#e11d48]/40' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.type === 'SOS'
                      ? 'bg-[#dc2626]/10 text-[#dc2626] dark:text-[#e5484d]'
                      : 'bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6]'
                  }`}
                >
                  {item.type === 'SOS' ? (
                    <FiAlertTriangle className="w-4 h-4 dispatch-icon" />
                  ) : (
                    <FiInfo className="w-4 h-4 dispatch-icon" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium text-sm text-[#171717] dark:text-[#ededed]">{item.title}</h2>
                    {!item.isRead && (
                      <span className="status-tag mono-tag-rose">
                        {isBn ? 'নতুন' : 'Unread'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#525252] dark:text-[#a1a1a6] leading-relaxed">{item.message}</p>
                  <span className="text-xs text-[#737373] dark:text-[#85858b] font-mono tabular-nums block pt-1">
                    {formatDate(item.createdAt || item.timestamp, isBn)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="h-8 w-8 rounded-lg text-[#737373] dark:text-[#85858b] hover:text-[#16a34a] dark:hover:text-[#4cc38a] hover:bg-[#f4f4f5] dark:hover:bg-[#232325] flex items-center justify-center transition-colors cursor-pointer"
                    title={isBn ? 'পঠিত হিসেবে চিহ্নিত করুন' : 'Mark as read'}
                  >
                    <FiCheck className="w-4 h-4 dispatch-icon" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="h-8 w-8 rounded-lg text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] hover:bg-[#f4f4f5] dark:hover:bg-[#232325] flex items-center justify-center transition-colors cursor-pointer"
                  title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                >
                  <FiTrash2 className="w-4 h-4 dispatch-icon" />
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
