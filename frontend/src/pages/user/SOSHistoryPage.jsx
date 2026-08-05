import React from 'react';
import { FiClock, FiAlertTriangle } from 'react-icons/fi';
import { useSOS } from '../../context/SOSContext';
import SOSHistoryList from '../../components/sos/SOSHistoryList';

const SOSHistoryPage = () => {
  const { sosHistory } = useSOS();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-red-600/30">
          <FiClock />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading">SOS Distress History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete log of all past and active emergency distress broadcasts.</p>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <SOSHistoryList history={sosHistory} />
      </div>
    </div>
  );
};

export default SOSHistoryPage;
