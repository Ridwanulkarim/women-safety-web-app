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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
          {isBn ? 'নিরাপত্তা জার্নাল' : 'Safety journal'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          {isBn ? 'নিরাপত্তা ও আত্মরক্ষা বিষয়ক প্রবন্ধ' : 'Field guides and legal updates'}
        </h1>
        <p className="text-base text-[#525252] dark:text-[#a1a1a6]">
          {isBn ? 'বিশেষজ্ঞদের পরামর্শ, আইনি তথ্য এবং বাস্তব জীবনের নিরাপত্তা গাইডলাইন' : 'Practical survival guides, legal handbooks, and privacy practices'}
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
              className="surface-card product-card-hover overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-52 overflow-hidden bg-[#141415]">
                <img
                  src={blog.imageUrl}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#737373] dark:text-[#85858b]">
                    <span className="status-tag">{displayCategory}</span>
                    <span className="flex items-center gap-1.5">
                      <FiUser className="w-3.5 h-3.5 dispatch-icon" /> {displayAuthor}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono tabular-nums">
                      <FiClock className="w-3.5 h-3.5 dispatch-icon" /> {formatDate(blog.createdAt, isBn)}
                    </span>
                  </div>
                  <h2 className="text-lg font-medium text-[#171717] dark:text-[#ededed] group-hover:text-[#e11d48] dark:group-hover:text-[#fb7185] transition-colors leading-snug">
                    {displayTitle}
                  </h2>
                  <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
                    {truncateText(displaySummary, 130)}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e11d48] dark:text-[#fb7185] pt-2">
                  {isBn ? 'সম্পূর্ণ পড়ুন' : 'Read article'} <FiArrowRight className="w-3.5 h-3.5 dispatch-icon" />
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
