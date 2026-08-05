import React from 'react';
import { FiPhoneCall, FiUser, FiTrash2, FiStar } from 'react-icons/fi';

const ContactCard = ({ contact, onDelete }) => {
  return (
    <div className="glass-card p-5 rounded-2xl flex items-center justify-between gap-4 transition hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-md">
          <FiUser />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">{contact.name}</h4>
            {contact.isPrimary && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 uppercase">
                <FiStar /> Primary
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{contact.relationship}</p>
          <a
            href={`tel:${contact.phone}`}
            className="text-sm font-semibold text-pink-600 dark:text-pink-400 hover:underline inline-block mt-0.5"
          >
            {contact.phone}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={`tel:${contact.phone}`}
          className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base shadow-md transition"
          title="Direct Speed Dial"
        >
          <FiPhoneCall />
        </a>

        {onDelete && (
          <button
            onClick={() => onDelete(contact.id)}
            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-base transition"
            title="Delete Contact"
          >
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
