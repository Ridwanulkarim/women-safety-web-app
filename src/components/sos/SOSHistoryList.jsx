import React from 'react';
import { FiMapPin, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { formatDate, localizeNum } from '../../utils/helpers';
import { useLanguage } from '../../context/LanguageContext';

const SOSHistoryList = ({ history = [] }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!history || history.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-[#fafafa] dark:bg-[#141415] border border-dashed border-zinc-900/[0.12] dark:border-white/[0.12] text-center space-y-2">
        <FiCheckCircle className="w-6 h-6 mx-auto text-[#737373] dark:text-[#85858b] dispatch-icon" />
        <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
          {isBn ? 'কোনো এসওএস ইতিহাস নেই' : 'No distress history'}
        </h3>
        <p className="text-xs text-[#737373] dark:text-[#85858b]">
          {isBn
            ? 'আপনার কোনো সক্রিয় বা পূর্ববর্তী জরুরি এসওএস রেকর্ড পাওয়া যায়নি।'
            : 'No active or historical emergency SOS activations logged.'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-900/[0.08] dark:divide-white/[0.08]">
      {history.map((item) => (
        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                item.status === 'ACTIVE'
                  ? 'bg-[#dc2626]/10 text-[#dc2626] dark:text-[#e5484d]'
                  : 'bg-[#16a34a]/10 dark:bg-[#4cc38a]/15 text-[#16a34a] dark:text-[#4cc38a]'
              }`}
            >
              {item.status === 'ACTIVE' ? (
                <FiAlertTriangle className="w-4 h-4 dispatch-icon" />
              ) : (
                <FiCheckCircle className="w-4 h-4 dispatch-icon" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`status-tag ${
                    item.status === 'ACTIVE' ? 'mono-tag-rose' : 'mono-tag-emerald'
                  }`}
                >
                  {item.status === 'ACTIVE' ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'সমাধানকৃত' : 'Resolved')}
                </span>
                <span className="text-xs text-[#737373] dark:text-[#85858b] flex items-center gap-1 font-mono tabular-nums">
                  <FiClock className="w-3.5 h-3.5 dispatch-icon" /> {formatDate(item.timestamp, isBn)}
                </span>
              </div>

              <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-1.5">
                <FiMapPin className="w-3.5 h-3.5 text-[#e11d48] shrink-0 dispatch-icon" />
                <span>{item.address}</span>
              </p>

              <p className="text-xs text-[#737373] dark:text-[#85858b] font-mono tabular-nums">
                {localizeNum(item.latitude, isBn)}, {localizeNum(item.longitude, isBn)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SOSHistoryList;
