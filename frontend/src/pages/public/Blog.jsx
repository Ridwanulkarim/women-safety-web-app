import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import { formatDate, truncateText } from '../../utils/helpers';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.data?.data) {
          setBlogs(res.data.data);
        }
      } catch (e) {
        setBlogs([
          {
            id: 'blog-1',
            title: 'Essential Self-Defense Strategies Every Woman Should Know',
            summary: 'Learn practical physical awareness and tactical self-defense maneuvers.',
            author: 'SafeHaven Team',
            category: 'Self Defense',
            imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
            createdAt: new Date().toISOString()
          },
          {
            id: 'blog-2',
            title: 'Digital Safety: Protecting Your Location & Online Privacy',
            summary: 'How to prevent cyber-stalking, secure mobile permissions, and manage location sharing.',
            author: 'Cyber Safety Expert',
            category: 'Digital Safety',
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-heading">Safety & Protection Journal</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Insights, legal updates, and situational survival tips from security professionals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="glass-card rounded-3xl overflow-hidden hover:border-pink-500/40 transition group flex flex-col justify-between">
            <div className="relative h-56 overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-pink-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                {blog.category}
              </span>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><FiUser /> {blog.author}</span>
                  <span className="flex items-center gap-1"><FiClock /> {formatDate(blog.createdAt)}</span>
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100 group-hover:text-pink-600 transition">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {truncateText(blog.summary || blog.content, 120)}
                </p>
              </div>

              <Link
                to={`/blog/${blog.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline pt-2"
              >
                Read Article <FiArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
