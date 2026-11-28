import React, { useState, useEffect } from 'react';
import { FiSearch, FiBookOpen, FiTag, FiShield } from 'react-icons/fi';
import api from '../../services/api';
import { TIP_CATEGORIES } from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';

const KNOWN_TIPS_TRANSLATIONS = {
  'Commuting at Night': {
    title_bn: 'রাতের যাত্রা ও যাতায়াতের নিরাপত্তা',
    content_bn: 'সবসময় আলোযুক্ত রাস্তায় চলুন, বিশ্বস্ত পরিচিতদের সাথে লাইভ ট্রিপ লোকেশন শেয়ার করুন এবং রাতে একা চলার সময় দুই কানে হেডফোন গুঁজে রাখবেন না।'
  },
  'Ride-Sharing Security Checklist': {
    title_bn: 'রাইডশেয়ারিং নিরাপত্তা চেকলিস্ট',
    content_bn: 'গাড়িতে ওঠার আগে চালকের ছবি ও গাড়ির নম্বর প্লেট অ্যাপের সাথে মিলিয়ে নিন এবং পেছনের সিটে বসুন।'
  },
  'Home Entrance Vigilance': {
    title_bn: 'বাসার প্রবেশদ্বারে সতর্কতা',
    content_bn: 'দরজার সামনে আসার আগেই চাবি হাতে রাখুন। ভেতরে প্রবেশের আগে আশেপাশের পরিবেশ দেখে নিন এবং দ্রুত ছিটকিনি লাগিয়ে দিন।'
  },
  'Night Travel & Rideshare Security Checklist': {
    title_bn: 'রাতের যাত্রা ও রাইডশেয়ারিং নিরাপত্তা চেকলিস্ট',
    content_bn: 'গাড়িতে ওঠার আগে অবশ্যই ড্রাইভারের ছবি, নাম ও গাড়ির নম্বর প্লেট অ্যাপের তথ্যের সাথে মিলিয়ে নিন। সবসময় পেছনের সিটে বসুন এবং পরিবারের সাথে লাইভ ট্রিপ শেয়ার করুন।'
  },
  'Physical Self-Defense Stance & Vulnerable Targets': {
    title_bn: 'শারীরিক আত্মরক্ষার সঠিক ভঙ্গি ও সংবেদনশীল পয়েন্ট',
    content_bn: 'দুই পা কিছুটা ফাঁকা করে ভারসাম্য বজায় রাখুন এবং হাত বুকের কাছে প্রস্তুত রাখুন। আক্রান্ত হলে হাতের তালুর আঘাত বা কনুই দিয়ে আক্রমণকারীর চোখ, নাক, গলা বা সংবেদনশীল পয়েন্টে আঘাত করুন।'
  },
  'De-escalation & Spatial Boundary Defense': {
    title_bn: 'পরিস্থিতি শান্ত করা ও নিরাপদ দূরত্ব বজায় রাখা',
    content_bn: 'অপরিচিত ব্যক্তির থেকে কমপক্ষে ৬ ফুট দূরত্ব বজায় রাখুন। আক্রমণাত্মক আচরণ দেখলে স্পষ্ট ও বলিষ্ঠ কণ্ঠে চিৎকার করে "দূরে থাকুন" বলুন যাতে আশেপাশের মানুষের দৃষ্টি আকর্ষণ হয়।'
  },
  'Utilizing Improvised Defense Items': {
    title_bn: 'দৈনন্দিন জিনিসপত্র দিয়ে আত্মরক্ষা',
    content_bn: 'আঙুলের ফাঁকে শক্ত করে রাখা চাবি, উচ্চ শব্দের অ্যালার্ম, ছাতা বা ভারী ব্যাগ যেকোনো জরুরি পরিস্থিতিতে আত্মরক্ষার কার্যকর হাতিয়ার হিসেবে ব্যবহার করতে পারেন।'
  },
  'App Location Privacy & Geolocation Audit': {
    title_bn: 'অ্যাপের লোকেশন প্রাইভেসী ও ট্র্যাকিং অডিট',
    content_bn: 'ফোনের অ্যাপ পারমিশন নিয়মিত পরীক্ষা করুন। সামাজিক যোগাযোগ মাধ্যম বা অপ্রয়োজনীয় অ্যাপের ব্যাকগ্রাউন্ড লোকেশন বন্ধ রাখুন যাতে কেউ আপনাকে ট্র্যাক করতে না পারে।'
  },
  'Two-Factor Authentication (2FA) Security': {
    title_bn: 'টু-ফ্যাক্টর অথেনটিকেশন (২এফএ) নিরাপত্তা',
    content_bn: 'ইমেইল, ফেসবুক, হোয়াটসঅ্যাপ ও ব্যাংকিং অ্যাকাউন্টে টু-ফ্যাক্টর অথেনটিকেশন চালু রাখুন যাতে পাসওয়ার্ড জানা থাকলেও কেউ আপনার অ্যাকাউন্টে ঢুকতে না পারে।'
  },
  'Real-Time Posting & Check-In Safety': {
    title_bn: 'রিয়েল-টাইম লোকেশন চেক-ইন সতর্কবার্তা',
    content_bn: 'সোশ্যাল মিডিয়ায় কোনো জায়গায় থাকাকালীন সাথে সাথে লাইভ চেক-ইন বা ছবি পোস্ট করবেন না। স্থানটি ত্যাগ করার পর পোস্ট করা অনেক বেশি নিরাপদ।'
  },
  'Public Transit & Commute Awareness': {
    title_bn: 'গণপরিবহন ও রাস্তায় চলার সতর্কতা',
    content_bn: 'আলোযুক্ত স্থানে অপেক্ষা করুন। একা হাঁটার সময় দুই কানেই নয়েজ-ক্যানসেলিং হেডফোন পরে গান শুনবেন না, যাতে আশেপাশের গতিবিধি ও আওয়াজ টের পাওয়া যায়।'
  },
  'Hotel & Temporary Lodging Security': {
    title_bn: 'হোটেল ও অস্থায়ী আবাসন নিরাপত্তা',
    content_bn: 'হোটেল রুমের দরজায় সেফটি লক বা ডোর স্টপার ব্যবহার করুন। দরজার ওপাশে কোনো হোটেল কর্মী পরিচয় দিলে নিশ্চিত না হয়ে দরজা খুলবেন না।'
  },
  'Late-Night Overtime Safety Protocol': {
    title_bn: 'দেরিতে অফিস শেষে ফেরার সতর্কতা',
    content_bn: 'দেরি করে অফিস শেষ হলে অফিসের সিকিউরিটি টিমকে জানিয়ে রাখুন এবং নিরাপদ কোনো বাহন না আসা পর্যন্ত অফিস ভবনের ভেতরে অপেক্ষা করুন।'
  },
  'Documenting Workplace Harassment': {
    title_bn: 'কর্মক্ষেত্রে হয়রানির প্রমাণাদি সংরক্ষণ',
    content_bn: 'কর্মক্ষেত্রে কোনো অনাকাঙ্ক্ষিত আচরণ বা হেনস্তার শিকার হলে তারিখ, সময়, কথোপকথন এবং স্ক্রিনশট নিরাপদ ক্লাউড বা ভল্টে সংরক্ষণ করে রাখুন।'
  },
  'Emergency Building Evacuation Routes': {
    title_bn: 'অফিস ভবনের জরুরি প্রস্থান পথ',
    content_bn: 'আপনার অফিসের জরুরি সিঁড়ি, ফায়ার এক্সিট এবং জরুরি অ্যালার্ম বাটন কোথায় রয়েছে তা আগেই চিনে রাখুন।'
  },
  'Home Entrance & Doorway Vigilance': {
    title_bn: 'বাসার প্রবেশদ্বার ও সতর্ক দরজা খোলা',
    content_bn: 'দরজার সামনে আসার আগেই চাবি হাতে প্রস্তুত রাখুন। দরজা খোলার আগে আশেপাশের পরিবেশ একনজর দেখে নিন এবং দ্রুত ভেতরে ঢুকে ছিটকিনি লাগিয়ে দিন।'
  },
  'Deadbolts & Secondary Window Locks': {
    title_bn: 'দরজা-জানালায় মজবুত লক ও সিকিউরিটি ডোর',
    content_bn: 'বাসার মূল দরজায় শক্ত ডেডবোল্ট ও ম্যাজিক আই (Peephole) রাখুন। নিচতলা বা ব্যালকনির জানালায় মজবুত গ্রিল নিশ্চিত করুন।'
  },
  'Trusted Neighbor Emergency Network': {
    title_bn: 'বিশ্বস্ত প্রতিবেশীর সাথে জরুরি যোগাযোগ',
    content_bn: 'বিপদের সময় সাহায্যের জন্য পাশের বাসার বিশ্বস্ত প্রতিবেশীর সাথে যোগাযোগ রাখুন এবং ৯৯৯, ১০৯ ও অন্যান্য জরুরি নম্বর দরজার পাশে ঝুলিয়ে রাখুন।'
  },
  'Legal Protection Under Nari O Shishu Nirjatan Daman Ain': {
    title_bn: 'নারী ও শিশু নির্যাতন দমন আইনের আওতায় আইনি সুরক্ষা',
    content_bn: 'বাংলাদেশ আইনে যৌন হয়রানি, উত্ত্যক্ত করা ও পারিবারিক সহিংসতা জামিন অযোগ্য ও কঠোর শাস্তিযোগ্য অপরাধ। ভুক্তভোগীর তাৎক্ষণিক আইনি সহায়তা পাওয়ার পূর্ণ অধিকার রয়েছে।'
  },
  'Filing a General Diary (GD) or FIR at Police Stations': {
    title_bn: 'থানায় সাধারণ ডায়েরি (জিডি) বা এফআইআর দায়ের করার নিয়ম',
    content_bn: 'যেকোনো হুমকি বা বিপদে থানায় জিডি বা মামলা নেওয়ার জন্য পুলিশ আইনত বাধ্য। জিডি দায়ের করার পর অবশ্যই সিল ও স্বাক্ষরসহ অনুলিপি সংগ্রহ করুন।'
  },
  'Access to Government Free Legal Aid (16430)': {
    title_bn: 'সরকারি বিনামূল্যে আইনি সহায়তা সেবা (১৬৪৩০)',
    content_bn: 'বাংলাদেশ সরকারের জাতীয় আইনগত সহায়তা প্রদান সংস্থার টোল-ফ্রি নম্বর ১৬৪৩০-এ কল করে বিনা খরচে আইনি পরামর্শ ও আইনজীবী সেবা পাওয়া যায়।'
  }
};

const DEFAULT_SAFETY_TIPS = [
  // Self Defense
  {
    id: 'tip-sd-1',
    title: 'Physical Self-Defense Stance & Vulnerable Targets',
    title_bn: 'শারীরিক আত্মরক্ষার সঠিক ভঙ্গি ও সংবেদনশীল পয়েন্ট',
    category: 'Self Defense',
    content: 'Maintain a balanced wide stance with hands up at chest level. Target vulnerable areas like eyes, nose, throat, groin, and shins using palm strikes or elbows.',
    content_bn: 'দুই পা কিছুটা ফাঁকা করে ভারসাম্য বজায় রাখুন এবং হাত বুকের কাছে প্রস্তুত রাখুন। আক্রান্ত হলে হাতের তালুর আঘাত বা কনুই দিয়ে আক্রমণকারীর চোখ, নাক, গলা বা সংবেদনশীল পয়েন্টে আঘাত করুন।'
  },
  {
    id: 'tip-sd-2',
    title: 'De-escalation & Spatial Boundary Defense',
    title_bn: 'পরিস্থিতি শান্ত করা ও নিরাপদ দূরত্ব বজায় রাখা',
    category: 'Self Defense',
    content: 'Maintain at least a 6-foot buffer zone from strangers. Use a loud, clear, assertive voice to command "STEP BACK" to draw public attention.',
    content_bn: 'অপরিচিত ব্যক্তির থেকে কমপক্ষে ৬ ফুট দূরত্ব বজায় রাখুন। আক্রমণাত্মক আচরণ দেখলে স্পষ্ট ও বলিষ্ঠ কণ্ঠে চিৎকার করে "দূরে থাকুন" বলুন যাতে আশেপাশের মানুষের দৃষ্টি আকর্ষণ হয়।'
  },
  {
    id: 'tip-sd-3',
    title: 'Utilizing Improvised Defense Items',
    title_bn: 'দৈনন্দিন জিনিসপত্র দিয়ে আত্মরক্ষা',
    category: 'Self Defense',
    content: 'Everyday items like keys held securely between fingers, a high-decibel alarm, or a heavy bag can serve as defensive tools in critical situations.',
    content_bn: 'আঙুলের ফাঁকে শক্ত করে রাখা চাবি, উচ্চ শব্দের অ্যালার্ম, ছাতা বা ভারী ব্যাগ যেকোনো জরুরি পরিস্থিতিতে আত্মরক্ষার কার্যকর হাতিয়ার হিসেবে ব্যবহার করতে পারেন।'
  },

  // Digital Safety
  {
    id: 'tip-ds-1',
    title: 'App Location Privacy & Geolocation Audit',
    title_bn: 'অ্যাপের লোকেশন প্রাইভেসী ও ট্র্যাকিং অডিট',
    category: 'Digital Safety',
    content: 'Audit app permissions regularly. Disable background location tracking for social media and non-essential applications to prevent stalker tracking.',
    content_bn: 'ফোনের অ্যাপ পারমিশন নিয়মিত পরীক্ষা করুন। সামাজিক যোগাযোগ মাধ্যম বা অপ্রয়োজনীয় অ্যাপের ব্যাকগ্রাউন্ড লোকেশন বন্ধ রাখুন যাতে কেউ আপনাকে ট্র্যাক করতে না পারে।'
  },
  {
    id: 'tip-ds-2',
    title: 'Two-Factor Authentication (2FA) Security',
    title_bn: 'টু-ফ্যাক্টর অথেনটিকেশন (২এফএ) নিরাপত্তা',
    category: 'Digital Safety',
    content: 'Enable 2FA via authenticator apps across all email, social media, and banking accounts to block unauthorized login attempts and account hijacking.',
    content_bn: 'ইমেইল, ফেসবুক, হোয়াটসঅ্যাপ ও ব্যাংকিং অ্যাকাউন্টে টু-ফ্যাক্টর অথেনটিকেশন চালু রাখুন যাতে পাসওয়ার্ড জানা থাকলেও কেউ আপনার অ্যাকাউন্টে ঢুকতে না পারে।'
  },
  {
    id: 'tip-ds-3',
    title: 'Real-Time Posting & Check-In Safety',
    title_bn: 'রিয়েল-টাইম লোকেশন চেক-ইন সতর্কবার্তা',
    category: 'Digital Safety',
    content: 'Avoid posting real-time location check-ins or event stories on public social channels. Share photos or check-ins after leaving the venue.',
    content_bn: 'সোশ্যাল মিডিয়ায় কোনো জায়গায় থাকাকালীন সাথে সাথে লাইভ চেক-ইন বা ছবি পোস্ট করবেন না। স্থানটি ত্যাগ করার পর পোস্ট করা অনেক বেশি নিরাপদ।'
  },

  // Travel Safety
  {
    id: 'tip-ts-1',
    title: 'Night Travel & Rideshare Security Checklist',
    title_bn: 'রাতের যাত্রা ও রাইডশেয়ারিং নিরাপত্তা চেকলিস্ট',
    category: 'Travel Safety',
    content: 'Always match driver photo, name, and vehicle license plate before entering a rideshare. Sit in the rear passenger seat and share live trip tracking with family.',
    content_bn: 'গাড়িতে ওঠার আগে অবশ্যই ড্রাইভারের ছবি, নাম ও গাড়ির নম্বর প্লেট অ্যাপের তথ্যের সাথে মিলিয়ে নিন। সবসময় পেছনের সিটে বসুন এবং পরিবারের সাথে লাইভ ট্রিপ শেয়ার করুন।'
  },
  {
    id: 'tip-ts-2',
    title: 'Public Transit & Commute Awareness',
    title_bn: 'গণপরিবহন ও রাস্তায় চলার সতর্কতা',
    category: 'Travel Safety',
    content: 'Stay in well-lit designated waiting zones or near transit conductors. Avoid wearing dual noise-canceling headphones while walking alone.',
    content_bn: 'আলোযুক্ত স্থানে অপেক্ষা করুন। একা হাঁটার সময় দুই কানেই নয়েজ-ক্যানসেলিং হেডফোন পরে গান শুনবেন না, যাতে আশেপাশের গতিবিধি ও আওয়াজ টের পাওয়া যায়।'
  },
  {
    id: 'tip-ts-3',
    title: 'Hotel & Temporary Lodging Security',
    title_bn: 'হোটেল ও অস্থায়ী আবাসন নিরাপত্তা',
    category: 'Travel Safety',
    content: 'Use secondary door stoppers or portable deadbolts in hotel rooms. Verify hotel maintenance staff credentials before opening your door.',
    content_bn: 'হোটেল রুমের দরজায় সেফটি লক বা ডোর স্টপার ব্যবহার করুন। দরজার ওপাশে কোনো হোটেল কর্মী পরিচয় দিলে নিশ্চিত না হয়ে দরজা খুলবেন না।'
  },

  // Workplace Safety
  {
    id: 'tip-ws-1',
    title: 'Late-Night Overtime Safety Protocol',
    title_bn: 'দেরিতে অফিস শেষে ফেরার সতর্কতা',
    category: 'Workplace Safety',
    content: 'Inform building security when working late. Request security guards to escort you to your vehicle or taxi pickup location.',
    content_bn: 'দেরি করে অফিস শেষ হলে অফিসের সিকিউরিটি টিমকে জানিয়ে রাখুন এবং নিরাপদ কোনো বাহন না আসা পর্যন্ত অফিস ভবনের ভেতরে অপেক্ষা করুন।'
  },
  {
    id: 'tip-ws-2',
    title: 'Documenting Workplace Harassment',
    title_bn: 'কর্মক্ষেত্রে হয়রানির প্রমাণাদি সংরক্ষণ',
    category: 'Workplace Safety',
    content: 'Keep an independent paper or digital log of any inappropriate incidents, including exact dates, times, messages, and witnesses for internal complaints.',
    content_bn: 'কর্মক্ষেত্রে কোনো অনাকাঙ্ক্ষিত আচরণ বা হেনস্তার শিকার হলে তারিখ, সময়, কথোপকথন এবং স্ক্রিনশট নিরাপদ ক্লাউড বা ভল্টে সংরক্ষণ করে রাখুন।'
  },
  {
    id: 'tip-ws-3',
    title: 'Emergency Building Evacuation Routes',
    title_bn: 'অফিস ভবনের জরুরি প্রস্থান পথ',
    category: 'Workplace Safety',
    content: 'Familiarize yourself with office emergency stairwells, fire exits, emergency alarms, and secondary escape routes on your floor.',
    content_bn: 'আপনার অফিসের জরুরি সিঁড়ি, ফায়ার এক্সিট এবং জরুরি অ্যালার্ম বাটন কোথায় রয়েছে তা আগেই চিনে রাখুন।'
  },

  // Home Safety
  {
    id: 'tip-hs-1',
    title: 'Home Entrance & Doorway Vigilance',
    title_bn: 'বাসার প্রবেশদ্বার ও সতর্ক দরজা খোলা',
    category: 'Home Safety',
    content: 'Have house keys ready in hand before reaching your front door. Scan your surroundings before unlocking and stepping inside.',
    content_bn: 'দরজার সামনে আসার আগেই চাবি হাতে প্রস্তুত রাখুন। দরজা খোলার আগে আশেপাশের পরিবেশ একনজর দেখে নিন এবং দ্রুত ভেতরে ঢুকে ছিটকিনি লাগিয়ে দিন।'
  },
  {
    id: 'tip-hs-2',
    title: 'Deadbolts & Secondary Window Locks',
    title_bn: 'দরজা-জানালায় মজবুত লক ও সিকিউরিটি ডোর',
    category: 'Home Safety',
    content: 'Ensure all exterior doors have solid deadbolt locks and door peepholes. Install window locks or security bars on ground-floor windows.',
    content_bn: 'বাসার মূল দরজায় শক্ত ডেডবোল্ট ও ম্যাজিক আই (Peephole) রাখুন। নিচতলা বা ব্যালকনির জানালায় মজবুত গ্রিল নিশ্চিত করুন।'
  },
  {
    id: 'tip-hs-3',
    title: 'Trusted Neighbor Emergency Network',
    title_bn: 'বিশ্বস্ত প্রতিবেশীর সাথে জরুরি যোগাযোগ',
    category: 'Home Safety',
    content: 'Establish a code word with trusted neighbors. Keep emergency helpline numbers (999, 109, 1098) printed near your main entrance.',
    content_bn: 'বিপদের সময় সাহায্যের জন্য পাশের বাসার বিশ্বস্ত প্রতিবেশীর সাথে যোগাযোগ রাখুন এবং ৯৯৯, ১০৯ ও অন্যান্য জরুরি নম্বর দরজার পাশে ঝুলিয়ে রাখুন।'
  },

  // Legal Rights
  {
    id: 'tip-lr-1',
    title: 'Legal Protection Under Nari O Shishu Nirjatan Daman Ain',
    title_bn: 'নারী ও শিশু নির্যাতন দমন আইনের আওতায় আইনি সুরক্ষা',
    category: 'Legal Rights',
    content: 'Under Bangladesh law, sexual harassment, stalking, and domestic abuse are strictly punishable offences. Victims have the right to immediate police action.',
    content_bn: 'বাংলাদেশ আইনে যৌন হয়রানি, উত্ত্যক্ত করা ও পারিবারিক সহিংসতা জামিন অযোগ্য ও কঠোর শাস্তিযোগ্য অপরাধ। ভুক্তভোগীর তাৎক্ষণিক আইনি সহায়তা পাওয়ার পূর্ণ অধিকার রয়েছে।'
  },
  {
    id: 'tip-lr-2',
    title: 'Filing a General Diary (GD) or FIR at Police Stations',
    title_bn: 'থানায় সাধারণ ডায়েরি (জিডি) বা এফআইআর দায়ের করার নিয়ম',
    category: 'Legal Rights',
    content: 'Police stations are legally obligated to record a General Diary (GD) or First Information Report (FIR). Request an official receipt copy with police seal.',
    content_bn: 'যেকোনো হুমকি বা বিপদে থানায় জিডি বা মামলা নেওয়ার জন্য পুলিশ আইনত বাধ্য। জিডি দায়ের করার পর অবশ্যই সিল ও স্বাক্ষরসহ অনুলিপি সংগ্রহ করুন।'
  },
  {
    id: 'tip-lr-3',
    title: 'Access to Government Free Legal Aid (16430)',
    title_bn: 'সরকারি বিনামূল্যে আইনি সহায়তা সেবা (১৬৪৩০)',
    category: 'Legal Rights',
    content: 'Call the National Legal Aid Services Organization toll-free helpline at 16430 for 24/7 free legal representation and advice across Bangladesh.',
    content_bn: 'বাংলাদেশ সরকারের জাতীয় আইনগত সহায়তা প্রদান সংস্থার টোল-ফ্রি নম্বর ১৬৪৩০-এ কল করে বিনা খরচে আইনি পরামর্শ ও আইনজীবী সেবা পাওয়া যায়।'
  }
];

const categoryTranslations = {
  'All': 'সকল',
  'Self Defense': 'আত্মরক্ষা',
  'Digital Safety': 'ডিজিটাল নিরাপত্তা',
  'Travel Safety': 'ভ্রমণ নিরাপত্তা',
  'Workplace Safety': 'কর্মক্ষেত্র নিরাপত্তা',
  'Home Safety': 'বাসার নিরাপত্তা',
  'Legal Rights': 'আইনি অধিকার'
};

const SafetyTips = () => {
  const [tips, setTips] = useState(DEFAULT_SAFETY_TIPS);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await api.get('/safety-tips');
        if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
          const apiTips = res.data.data;
          const merged = [...apiTips];
          DEFAULT_SAFETY_TIPS.forEach(dt => {
            if (!merged.some(m => m.category === dt.category && m.title === dt.title)) {
              merged.push(dt);
            }
          });
          setTips(merged);
        } else {
          setTips(DEFAULT_SAFETY_TIPS);
        }
      } catch (e) {
        setTips(DEFAULT_SAFETY_TIPS);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  const getTipTitle = (tip) => {
    if (!isBn) return tip.title;
    return tip.title_bn || KNOWN_TIPS_TRANSLATIONS[tip.title]?.title_bn || tip.title;
  };

  const getTipContent = (tip) => {
    if (!isBn) return tip.content;
    return tip.content_bn || KNOWN_TIPS_TRANSLATIONS[tip.title]?.content_bn || tip.content;
  };

  const getTipCategory = (tipCat) => {
    if (!isBn) return tipCat;
    return categoryTranslations[tipCat] || tipCat;
  };

  const filteredTips = tips.filter(t => {
    const matchesCat = category === 'All' || t.category === category;
    const titleToSearch = getTipTitle(t);
    const contentToSearch = getTipContent(t);
    const matchesSearch =
      titleToSearch.toLowerCase().includes(search.toLowerCase()) ||
      contentToSearch.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
          {isBn ? 'জ্ঞানভাণ্ডার ও আইনি অধিকার' : 'Knowledge vault and legal rights'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          {isBn ? 'নিরাপত্তা টিপস ও আত্মরক্ষা নির্দেশিকা' : 'Safety tips and legal guidelines'}
        </h1>
        <p className="text-base text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
          {isBn
            ? 'বাস্তবধর্মী আত্মরক্ষা কৌশল, সাইবার নিরাপত্তা প্রোটোকল এবং বাংলাদেশে নারী সুরক্ষার আইনি অধিকার'
            : "Practical deterrence routines, digital privacy checks, and Bangladesh women's legal rights"}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="surface-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {TIP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`h-9 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[#171717] dark:bg-[#ededed] text-[#ffffff] dark:text-[#141415]'
                  : 'bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed]'
              }`}
            >
              {isBn ? (categoryTranslations[cat] || cat) : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <FiSearch className="w-4 h-4 absolute left-3 top-3 text-[#737373] dark:text-[#85858b] dispatch-icon" />
          <input
            type="text"
            placeholder={isBn ? 'খুঁজুন' : 'Search'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="human-input human-input-has-icon text-sm"
          />
        </div>
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="p-16 text-center text-sm text-[#737373] dark:text-[#85858b]">
          {isBn ? 'লোড হচ্ছে' : 'Loading safety guidelines'}
        </div>
      ) : filteredTips.length === 0 ? (
        <div className="surface-panel p-12 text-center space-y-3">
          <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? `"${search}" এর সাথে কোনো নির্দেশিকা মেলেনি` : `No guidelines match "${search}"`}
          </p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-outline h-9 px-4 text-xs">
            {isBn ? 'ফিল্টার মুছুন' : 'Reset filter'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="surface-card product-card-hover p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="status-tag">
                    <FiTag className="w-3.5 h-3.5 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                    {getTipCategory(tip.category)}
                  </span>
                  <FiBookOpen className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
                </div>
                <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed] leading-snug">
                  {getTipTitle(tip)}
                </h2>
                <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
                  {getTipContent(tip)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyTips;
