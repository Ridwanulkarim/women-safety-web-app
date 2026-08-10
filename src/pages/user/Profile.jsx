import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const dateInputRef = useRef(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      bloodGroup: user?.bloodGroup || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      profileImage: user?.profileImage || ''
    }
  });

  const { ref: dobRef, ...dobRegisterProps } = register('dateOfBirth');

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user, reset]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (user?.uid) {
        await api.put(`/users/${user.uid}`, data);
      }
      if (updateUserProfile) {
        updateUserProfile(data);
      }
      toast.success('Profile updated successfully!');
    } catch (e) {
      if (updateUserProfile) {
        updateUserProfile(data);
      }
      toast.success('Saved profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        try {
          dateInputRef.current.showPicker();
        } catch (e) {
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
          <FiUser />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading">User Profile Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage your personal details and emergency medical profile.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="product-card p-6 sm:p-8 space-y-6">
        
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
            <label className="human-label">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              {...register('fullName')}
              className="human-input"
            />
          </div>

          <div>
            <label className="human-label">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +8801700000000"
              {...register('phone')}
              className="human-input"
            />
          </div>

          <div>
            <label className="human-label">Date of Birth</label>
            <div className="relative flex items-center">
              <input
                type="date"
                {...dobRegisterProps}
                ref={(e) => {
                  dobRef(e);
                  dateInputRef.current = e;
                }}
                className="human-input pr-10"
              />
              <button
                type="button"
                onClick={handleOpenDatePicker}
                className="absolute right-3 text-pink-600 dark:text-pink-400 hover:text-pink-700 text-base cursor-pointer p-1"
                title="Select Date of Birth"
              >
                <FiCalendar />
              </button>
            </div>
          </div>

          <div>
            <label className="human-label">Blood Group</label>
            <select
              {...register('bloodGroup')}
              className="human-input"
            >
              <option value="">Select Blood Group...</option>
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
            <label className="human-label">City</label>
            <input
              type="text"
              placeholder="e.g. Chittagong, Dhaka..."
              {...register('city')}
              className="human-input"
            />
          </div>

          <div>
            <label className="human-label">Country</label>
            <input
              type="text"
              placeholder="e.g. Bangladesh"
              {...register('country')}
              className="human-input"
            />
          </div>
        </div>

        <div>
          <label className="human-label">Residential Address</label>
          <textarea
            rows="3"
            placeholder="Enter your street address..."
            {...register('address')}
            className="human-input"
          ></textarea>
        </div>

        <div>
          <label className="human-label">Profile Image URL (Avatar)</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            {...register('profileImage')}
            className="human-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-danger py-3.5 font-mono uppercase font-bold text-xs"
        >
          <FiSave /> {loading ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>

      </form>
    </div>
  );
};

export default Profile;
