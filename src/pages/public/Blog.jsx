import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import { formatDate, truncateText } from '../../utils/helpers';
import { BLOG_POSTS } from '../../data/blogData';
import { useLanguage } from '../../context/LanguageContext';

const blogBengaliMap = {
  'blog-1': {
    title: 'নারীদের জন্য প্রয়োজনীয় আত্মরক্ষা কৌশল ও সতর্কতামূলক পদক্ষেপ',
    summary: 'পাবলিক প্লেসে সচেতনতা, সঠিক শারীরিক ভঙ্গি এবং আক্রমণকারীকে তাৎক্ষণিক প্রতিহত করার বাস্তবসম্মত নির্দেশিকা।',
    category: 'আত্মরক্ষা',
    author: 'সেফহ্যাভেন সিকিউরিটি টিম'
  },
  'blog-2': {
    title: 'ডিজিটাল নিরাপত্তা: লাইভ লোকেশন প্রাইভেসী ও সাইবার সুরক্ষা',
    summary: 'সাইবার স্টকিং প্রতিরোধ, মোবাইল অ্যাপের পারমিশন নিয়ন্ত্রণ এবং সোশ্যাল মিডিয়ায় নিরাপদ থাকার উপায়।',
    category: 'ডিজিটাল নিরাপত্তা',
    author: 'সাইবার নিরাপত্তা বিশেষজ্ঞ'
  },
  'blog-3': {
    title: 'একা ভ্রমণের নিরাপত্তা: যাতায়াত ও রাতের জার্নি চেকলিস্ট',
    summary: 'রাইডশেয়ারিং, গণপরিবহন এবং রাতের বেলা একা চলাচলের জন্য অত্যন্ত গুরুত্বপূর্ণ সতর্কতা।',
    category: 'ভ্রমণ নিরাপত্তা',
    author: 'ভ্রমণ নিরাপত্তা স্পেশালিস্ট'
  },
  'blog-4': {
    title: 'আপনার আইনি অধিকার জানুন: কর্মক্ষেত্র ও জননিরাপত্তা হ্যান্ডবুক',
    summary: 'আইনি সুরক্ষা, কর্মক্ষেত্রে যৌন হয়রানি প্রতিরোধ আইন এবং সরাসরি জরুরি রিপোর্ট করার নিয়মাবলি।',
    category: 'আইনি অধিকার',
    author: 'আইনি অধিকার পরামর্শক'
  }
};

const Blog = () => {
  const [blogs, setBlogs] = useState(BLOG_POSTS);
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="mono-tag mono-tag-rose">
          {isBn ? 'নিরাপত্তা বিষয়ক জার্নাল' : 'Safety Intelligence Journal'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-zinc-900 dark:text-white">
          {isBn ? 'নিরাপত্তা ও আত্মরক্ষা বিষয়ক ' : 'Safety & Protection '}<span className="gradient-text-rose">{isBn ? 'ব্লগ' : 'Journal'}</span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {isBn ? 'বিশেষজ্ঞদের পরামর্শ, আইনি আপডেট এবং বাস্তব জীবনের জরুরি নিরাপত্তা গাইডলাইন।' : 'Insights, legal updates, and tactical survival tips from security professionals.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => {
          const bnData = blogBengaliMap[blog.id] || {};
          const displayTitle = isBn ? (bnData.title || blog.title) : blog.title;
          const displayCategory = isBn ? (bnData.category || blog.category) : blog.category;
          const displayAuthor = isBn ? (bnData.author || blog.author) : blog.author;
          const displaySummary = isBn ? (bnData.summary || blog.summary || blog.content) : (blog.summary || blog.content);

          return (
            <Link
              key={blog.id}
              to={`/blog/${blog.id}`}
              className="product-card rounded-xl overflow-hidden flex flex-col justify-between group hover:border-rose-500/50 transition duration-300 block"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={blog.imageUrl}
                  alt={displayTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-4 left-4 mono-tag mono-tag-rose shadow-md bg-zinc-950/80 text-white">
                  {displayCategory}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1"><FiUser /> {displayAuthor}</span>
                    <span className="flex items-center gap-1"><FiClock /> {formatDate(blog.createdAt, isBn)}</span>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-zinc-900 dark:text-white group-hover:text-rose-600 transition leading-snug">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {truncateText(displaySummary, 130)}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 group-hover:underline pt-2">
                  {isBn ? 'সম্পূর্ণ আর্টিকেল পড়ুন' : 'Read Article'} <FiArrowRight />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
