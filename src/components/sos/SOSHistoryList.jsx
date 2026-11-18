import React from 'react';
import { FiMapPin, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import { useLanguage } from '../../context/LanguageContext';

const SOSHistoryList = ({ history = [] }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!history || history.length === 0) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center space-y-3 text-slate-400">
        <FiCheckCircle className="w-12 h-12 mx-auto text-emerald-500/50" />
        <h4 className="font-bold text-slate-200">
          {isBn ? 'কোনো এসওএস ইতিহাস নেই' : 'No Distress History'}
        </h4>
        <p className="text-xs">
          {isBn ? 'আপনার কোনো সক্রিয় বা পূর্ববর্তী জরুরি এসওএস রেকর্ড পাওয়া যায়নি।' : 'You have no active or historical emergency SOS alerts logged.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div key={item.id} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl text-2xl flex-shrink-0 ${
              item.status === 'ACTIVE' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-emerald-500/20 text-emerald-500'
            }`}>
              {item.status === 'ACTIVE' ? <FiAlertTriangle /> : <FiCheckCircle />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  item.status === 'ACTIVE' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {item.status === 'ACTIVE' ? (isBn ? 'সক্রিয়' : 'ACTIVE') : (isBn ? 'সমাধানকৃত' : 'RESOLVED')}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <FiClock /> {formatDate(item.timestamp)}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <FiMapPin className="text-pink-500 flex-shrink-0" /> {item.address}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {isBn ? 'কোঅর্ডিনেটস:' : 'Coordinates:'} {item.latitude}, {item.longitude}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SOSHistoryList;
