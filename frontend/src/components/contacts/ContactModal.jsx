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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative max-w-md w-full human-card p-6 sm:p-8 space-y-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-lg bg-slate-100 dark:bg-slate-800"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">Add Emergency Contact</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter a trusted person's contact details (Max 5 contacts).</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="human-label">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Connor"
              {...register('name', { required: 'Name is required' })}
              className={`human-input ${errors.name ? 'human-input-error' : ''}`}
            />
            {errors.name && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="human-label">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +8801700000000"
              {...register('phone', { required: 'Phone number is required' })}
              className={`human-input ${errors.phone ? 'human-input-error' : ''}`}
            />
            {errors.phone && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="human-label">Relationship</label>
            <select
              {...register('relationship', { required: 'Relationship is required' })}
              className="human-input"
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPrimary"
              {...register('isPrimary')}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
            <label htmlFor="isPrimary" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Set as Primary Emergency Contact
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 btn-primary"
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
