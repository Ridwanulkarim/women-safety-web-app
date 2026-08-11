import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCheckCircle, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ProfilePictureUpload from '../../components/profile/ProfilePictureUpload';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile, logoutUser } = useAuth();
  const navigate = useNavigate();
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

  const handleImageUploadSuccess = (uploadedUrl) => {
    setValue('profilePictureUrl', uploadedUrl);
    setValue('profileImage', uploadedUrl);
    updateUserProfile({ profilePictureUrl: uploadedUrl, profileImage: uploadedUrl });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.put('/users/profile', data);
      const updated = res.data?.data || data;
      updateUserProfile(updated);
      toast.success('Profile updated successfully!');
    } catch (error) {
      updateUserProfile(data);
      toast.success('Profile updated locally!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="product-card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-heading text-zinc-900 dark:text-white">Profile Settings</h1>
          <p className="text-xs text-zinc-500">Manage your personal emergency identification & photo</p>
        </div>
        <span className="mono-tag mono-tag-emerald">
          <FiCheckCircle /> Verified
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="product-card p-6 sm:p-8 space-y-6">
        
        {/* Profile Picture Upload Component */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <label className="human-label text-center mb-3">Profile Picture (Firebase Storage)</label>
          <ProfilePictureUpload
            currentUrl={user?.profilePictureUrl || user?.profileImage}
            onUploadSuccess={handleImageUploadSuccess}
            userId={user?.uid}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="human-label">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Jane Doe"
                {...register('fullName', { required: 'Full name is required' })}
                className="human-input human-input-has-icon"
              />
            </div>
          </div>

          <div>
            <label className="human-label">Email Address (Read-only)</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-zinc-400" />
              <input
                type="email"
                disabled
                {...register('email')}
                className="human-input human-input-has-icon opacity-60 bg-zinc-100 dark:bg-zinc-900 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="human-label">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-3.5 text-zinc-400" />
              <input
                type="tel"
                placeholder="+880 1700000000"
                {...register('phone')}
                className="human-input human-input-has-icon"
              />
            </div>
          </div>

          <div>
            <label className="human-label">Date of Birth</label>
            <div className="relative">
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
                onClick={() => {
                  if (dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
                    dateInputRef.current.showPicker();
                  } else if (dateInputRef.current) {
                    dateInputRef.current.focus();
                  }
                }}
                className="absolute right-3 top-2.5 p-1 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                title="Open Calendar Picker"
              >
                <FiCalendar className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </button>
            </div>
          </div>

          <div>
            <label className="human-label">Gender</label>
            <select {...register('gender')} className="human-input">
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="human-label">Blood Group</label>
            <select {...register('bloodGroup')} className="human-input">
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="human-label">City</label>
            <input
              type="text"
              placeholder="e.g. Dhaka"
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

        {/* Prominent Mobile & Desktop Logout Button */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="w-full py-3 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
          >
            <FiLogOut className="w-4 h-4 text-rose-600" /> LOGOUT OF SAFEHAVEN ACCOUNT
          </button>
        </div>

      </form>
    </div>
  );
};

export default Profile;
