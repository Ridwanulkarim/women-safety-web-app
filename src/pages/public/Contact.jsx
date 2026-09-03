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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
        <span className="mono-tag mono-tag-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> Community & Technical Help
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          Get In <span className="gradient-text-rose">Touch</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Have questions, technical feedback, or need emergency response integration? We are here 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6">
          <div className="glass-card-xl p-7 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold font-heading text-zinc-900 dark:text-white">Contact Information</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
                  <FiMail />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold font-mono">Email Support</p>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm">support@safehaven-app.org</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold font-mono">Hotline Desk</p>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm">+880 9612-999999</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold font-mono">Headquarters</p>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card-xl p-7 sm:p-8 space-y-4">
          <h3 className="text-lg font-extrabold font-heading text-zinc-900 dark:text-white">Send Us a Message</h3>

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
              className="human-input resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full btn-danger py-3 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-rose-600/25"
          >
            <FiSend /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
