import React from 'react';
import { FiPhoneCall, FiUser, FiTrash2, FiStar } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const ContactCard = ({ contact, onDelete }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="surface-card product-card-hover p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] border border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-center text-[#525252] dark:text-[#a1a1a6] shrink-0">
          <FiUser className="w-4 h-4 dispatch-icon" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed] truncate">
              {contact.name}
            </h3>
            {contact.isPrimary && (
              <span className="status-tag mono-tag-rose shrink-0">
                <FiStar className="w-3 h-3 dispatch-icon" /> {isBn ? 'প্রধান' : 'Primary'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs">
            <span className="text-[#737373] dark:text-[#85858b]">{contact.relationship}</span>
            <span className="text-[#737373] dark:text-[#85858b]">·</span>
            <a
              href={`tel:${contact.phone}`}
              className="font-mono tabular-nums font-medium text-[#171717] dark:text-[#ededed] hover:text-[#e11d48] dark:hover:text-[#fb7185] transition-colors"
            >
              {contact.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`tel:${contact.phone}`}
          className="h-9 w-9 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center transition-colors"
          title={isBn ? 'সরাসরি কল করুন' : 'Call contact'}
        >
          <FiPhoneCall className="w-4 h-4 dispatch-icon" />
        </a>

        {onDelete && (
          <button
            onClick={() => onDelete(contact.id)}
            className="h-9 w-9 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] border border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-center transition-colors cursor-pointer"
            title={isBn ? 'পরিচিতি মুছুন' : 'Delete contact'}
          >
            <FiTrash2 className="w-4 h-4 dispatch-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
