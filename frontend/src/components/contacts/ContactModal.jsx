import React from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiPlusCircle } from 'react-icons/fi';

const ContactModal = ({ isOpen, onClose, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-100 font-heading">Add Emergency Contact</h3>
          <p className="text-xs text-slate-400">Enter a trusted person's contact details (Max 5 contacts).</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Connor"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-pink-500 text-sm"
            />
            {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +8801700000000"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-pink-500 text-sm"
            />
            {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship</label>
            <select
              {...register('relationship', { required: 'Relationship is required' })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-pink-500 text-sm"
            >
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Sister">Sister</option>
              <option value="Brother">Brother</option>
              <option value="Spouse">Spouse</option>
              <option value="Friend">Friend</option>
              <option value="Relative">Relative</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPrimary"
              {...register('isPrimary')}
              className="w-4 h-4 accent-pink-600 rounded"
            />
            <label htmlFor="isPrimary" className="text-xs font-medium text-slate-300">Set as Primary Emergency Contact</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
            >
              <FiPlusCircle /> Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
