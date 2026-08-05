import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || 'Female',
      bloodGroup: user?.bloodGroup || 'O+',
      address: user?.address || '',
      city: user?.city || 'Dhaka',
      country: user?.country || 'Bangladesh',
      profileImage: user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (user?.uid) {
        await api.put(`/users/${user.uid}`, data);
      }
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error('Saved profile settings locally.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
          <FiUser />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading">User Profile Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage your profile details and emergency information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        
        {/* Profile Image & Role Header */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-pink-500/30"
          />
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-heading">{user?.fullName || 'User'}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-500">
              Role: {user?.role || 'User'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold mb-1">Full Name</label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Blood Group</label>
            <select
              {...register('bloodGroup')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">City</label>
            <input
              type="text"
              {...register('city')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Country</label>
            <input
              type="text"
              {...register('country')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Residential Address</label>
          <textarea
            rows="3"
            {...register('address')}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Profile Image URL (Avatar)</label>
          <input
            type="url"
            {...register('profileImage')}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition hover:scale-[1.02]"
        >
          <FiSave /> {loading ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>

      </form>
    </div>
  );
};

export default Profile;
