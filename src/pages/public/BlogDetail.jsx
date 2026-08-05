import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock, FiShare2 } from 'react-icons/fi';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data?.data) {
          setBlog(res.data.data);
        }
      } catch (e) {
        setBlog({
          id,
          title: 'Essential Self-Defense Strategies Every Woman Should Know',
          content: 'Personal safety begins with situational awareness. Stay alert in low-light environments, trust your instincts, and keep emergency hotlines on speed dial. Maintain open physical stance, keep hands unencumbered, and communicate firmly with potential aggressors...',
          author: 'SafeHaven Security Team',
          category: 'Self Defense',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
          createdAt: new Date().toISOString()
        });
      }
    };
    fetchDetail();
  }, [id]);

  if (!blog) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline">
        <FiArrowLeft /> Back to Articles
      </Link>

      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">{blog.title}</h1>
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><FiUser /> {blog.author}</span>
            <span className="flex items-center gap-1"><FiClock /> {formatDate(blog.createdAt)}</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
            className="flex items-center gap-1 hover:text-pink-400 transition"
          >
            <FiShare2 /> Share
          </button>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-xl max-h-[400px]">
        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      <div className="glass-card p-8 rounded-3xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 font-sans">
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
