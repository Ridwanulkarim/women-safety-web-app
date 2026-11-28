import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock, FiShare2 } from 'react-icons/fi';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { BLOG_POSTS } from '../../data/blogData';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  
  const localArticle = BLOG_POSTS.find((b) => b.id === id) || BLOG_POSTS[0];
  const [blog, setBlog] = useState(localArticle);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchDetail = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data?.data && typeof res.data.data === 'object' && res.data.data.title) {
          setBlog(res.data.data);
        } else {
          setBlog(localArticle);
        }
      } catch (e) {
        setBlog(localArticle);
      }
    };
    fetchDetail();
  }, [id]);

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4 font-sans">
        <h2 className="text-xl font-semibold text-[#141415] dark:text-[#ededed]">
          {isBn ? 'নিবন্ধটি পাওয়া যায়নি' : 'Article not found'}
        </h2>
        <Link to="/blog" className="btn-solid text-xs py-2 px-4 inline-flex items-center gap-2">
          <FiArrowLeft className="dispatch-icon" /> {isBn ? 'ব্লগে ফিরে যান' : 'Back to journal'}
        </Link>
      </div>
    );
  }

  const title = isBn && blog.title_bn ? blog.title_bn : blog.title;
  const content = isBn && blog.content_bn ? blog.content_bn : blog.content;
  const category = isBn && blog.category_bn ? blog.category_bn : blog.category;
  const author = isBn && blog.author_bn ? blog.author_bn : blog.author;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-medium text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors">
        <FiArrowLeft className="w-4 h-4 dispatch-icon" /> {isBn ? 'সকল প্রবন্ধে ফিরে যান' : 'Back to journal'}
      </Link>

      <div className="space-y-4">
        <span className="status-tag">{category}</span>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed] leading-tight">
          {title}
        </h1>
        <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#85858b] border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><FiUser className="w-3.5 h-3.5 dispatch-icon" /> {author}</span>
            <span className="flex items-center gap-1.5 font-mono tabular-nums"><FiClock className="w-3.5 h-3.5 dispatch-icon" /> {formatDate(blog.createdAt, isBn)}</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success(isBn ? 'লিঙ্ক কপি হয়েছে' : 'Link copied to clipboard');
            }}
            className="flex items-center gap-1.5 hover:text-[#171717] dark:hover:text-[#ededed] transition-colors cursor-pointer"
          >
            <FiShare2 className="w-3.5 h-3.5 dispatch-icon" /> {isBn ? 'শেয়ার' : 'Share'}
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-zinc-900/[0.08] dark:border-white/[0.08] max-h-[400px]">
        <img src={blog.imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="surface-panel p-6 sm:p-8 text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed whitespace-pre-line space-y-4">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
