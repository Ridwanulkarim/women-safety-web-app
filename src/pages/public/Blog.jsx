import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import { formatDate, truncateText } from '../../utils/helpers';
import { BLOG_POSTS } from '../../data/blogData';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const [blogs, setBlogs] = useState(BLOG_POSTS);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setBlogs(res.data.data);
        }
      } catch (e) {
        setBlogs(BLOG_POSTS);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="mono-tag mono-tag-rose">Safety Intelligence Journal</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-zinc-900 dark:text-white">
          Safety & Protection Journal
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Insights, legal updates, and tactical survival tips from security professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to={`/blog/${blog.id}`}
            className="product-card rounded-xl overflow-hidden flex flex-col justify-between group hover:border-rose-500/50 transition duration-300 block"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 mono-tag mono-tag-rose shadow-md bg-zinc-950/80 text-white">
                {blog.category}
              </span>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1"><FiUser /> {blog.author}</span>
                  <span className="flex items-center gap-1"><FiClock /> {formatDate(blog.createdAt)}</span>
                </div>
                <h3 className="text-lg font-bold font-heading text-zinc-900 dark:text-white group-hover:text-rose-600 transition">
                  {blog.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {truncateText(blog.summary || blog.content, 130)}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 group-hover:underline pt-2">
                Read Article <FiArrowRight />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
