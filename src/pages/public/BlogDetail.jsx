import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock, FiShare2 } from 'react-icons/fi';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { BLOG_POSTS } from '../../data/blogData';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(() => {
    return BLOG_POSTS.find((b) => b.id === id) || BLOG_POSTS[0];
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data?.data) {
          setBlog(res.data.data);
        }
      } catch (e) {
        const fallback = BLOG_POSTS.find((b) => b.id === id) || BLOG_POSTS[0];
        setBlog(fallback);
      }
    };
    fetchDetail();
  }, [id]);

  if (!blog) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline">
        <FiArrowLeft /> Back to Articles
      </Link>

      <div className="space-y-4">
        <span className="mono-tag mono-tag-rose">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-zinc-900 dark:text-white leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><FiUser /> {blog.author}</span>
            <span className="flex items-center gap-1"><FiClock /> {formatDate(blog.createdAt)}</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
            className="flex items-center gap-1 hover:text-rose-600 transition cursor-pointer"
          >
            <FiShare2 /> Share
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-[400px]">
        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      <div className="product-card p-6 sm:p-8 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-sans space-y-4">
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
