import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ProfilePictureUpload from '../../components/profile/ProfilePictureUpload';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const dateInputRef = useRef(null);

  const { register, handleSubmit, reset, setValue } = useForm({
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
      profilePictureUrl: user?.profilePictureUrl || user?.profileImage || '',
      profileImage: user?.profileImage || user?.profilePictureUrl || ''
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
        profilePictureUrl: user.profilePictureUrl || user.profileImage || '',
        profileImage: user.profileImage || user.profilePictureUrl || ''
      });
    }
  }, [user, reset]);

  const [loading, setLoading] = useState(false);

  const handleImageUploadSuccess = async (downloadUrl) => {
    setValue('profilePictureUrl', downloadUrl);
    setValue('profileImage', downloadUrl);

    // Save uploaded profile picture URL directly to backend & AuthContext
    try {
      if (user?.uid) {
        await api.put(`/users/${user.uid}`, {
          profilePictureUrl: downloadUrl,
          profileImage: downloadUrl
        });
      }
      if (updateUserProfile) {
        updateUserProfile({
          profilePictureUrl: downloadUrl,
          profileImage: downloadUrl
        });
      }
    } catch (err) {
      if (updateUserProfile) {
        updateUserProfile({
          profilePictureUrl: downloadUrl,
          profileImage: downloadUrl
        });
      }
    }
  };

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
        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
          <FiUser />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading">User Profile Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage your personal details, avatar photo, and emergency medical profile.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="product-card p-6 sm:p-8 space-y-6">
        
        {/* Profile Image Upload & User Info Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-800/50 text-center sm:text-left">
          <ProfilePictureUpload
            currentUrl={user?.profilePictureUrl || user?.profileImage}
            userId={user?.uid || 'guest'}
            onUploadSuccess={handleImageUploadSuccess}
          />

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-heading">{user?.fullName || 'User'}</h3>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
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
                className="absolute right-3 text-rose-600 dark:text-rose-400 hover:text-rose-700 text-base cursor-pointer p-1"
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
