import React from 'react';
import { FiClock } from 'react-icons/fi';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';
import SOSHistoryList from '../../components/sos/SOSHistoryList';

const SOSHistoryPage = () => {
  const { sosHistory } = useSOS();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="surface-panel p-6 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center shrink-0">
          <FiClock className="w-5 h-5 dispatch-icon" />
        </div>
        <div>
          <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'এসওএস অ্যালার্ট ইতিহাস' : 'SOS alert history'}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isBn
              ? 'পূর্ববর্তী ও সক্রিয় সকল জরুরি এসওএস সংকেতের সম্পূর্ণ তালিকা'
              : 'Audit log of active and resolved emergency broadcasts'}
          </p>
        </div>
      </div>

      <div className="surface-panel p-6">
        <SOSHistoryList history={sosHistory} />
      </div>
    </div>
  );
};

export default SOSHistoryPage;
