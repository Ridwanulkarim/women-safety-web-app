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
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white">Get In Touch</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Have questions, feedback, or need community support? We are here 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="human-card p-8 space-y-6">
            <h3 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">Contact Information</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
                  <FiMail />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Email Support</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">support@safehaven-app.org</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Hotline Desk</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">+880 9612-999999</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
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

        <form onSubmit={handleSubmit(onSubmit)} className="human-card p-8 space-y-4">
          <h3 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">Send Us a Message</h3>

          <div>
            <label className="human-label">Your Name</label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              {...register('name')}
              className="human-input"
            />
          </div>

          <div>
            <label className="human-label">Your Email</label>
            <input
              type="email"
              required
              placeholder="jane@example.com"
              {...register('email')}
              className="human-input"
            />
          </div>

          <div>
            <label className="human-label">Message</label>
            <textarea
              rows="4"
              required
              placeholder="How can we help you?"
              {...register('message')}
              className="human-input"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3"
          >
            <FiSend /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
