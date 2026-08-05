import React from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    toast.success('Thank you! Your message has been sent to the SafeHaven support team.');
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-heading">Get In Touch</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Have questions, feedback, or need community support? We're here 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold font-heading">Contact Information</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-lg">
                  <FiMail />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Email Support</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">support@safehaven-app.org</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Hotline Desk</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">+880 9612-999999</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-lg">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Headquarters</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold font-heading">Send Us a Message</h3>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Name</label>
            <input
              type="text"
              required
              {...register('name')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Email</label>
            <input
              type="email"
              required
              {...register('email')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Message</label>
            <textarea
              rows="4"
              required
              {...register('message')}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm focus:outline-none focus:border-pink-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition hover:scale-105"
          >
            <FiSend /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
