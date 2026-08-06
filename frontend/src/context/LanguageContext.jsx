import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    // Navbar & Brand
    brandName: 'SafeHaven',
    onlineStatus: 'Online',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    sosDispatch: 'SOS DISPATCH',
    home: 'Home',
    about: 'About',
    features: 'Features',
    safetyTips: 'Safety Tips',
    emergencyHelp: 'Emergency Help',
    blog: 'Blog',
    contact: 'Contact',
    dashboard: 'Dashboard',
    profile: 'Profile',
    emergencyContacts: 'Emergency Contacts',
    sosHistory: 'SOS History',
    liveLocation: 'Live Location',
    notifications: 'Notifications',
    settings: 'Settings',
    evidenceVault: 'Evidence Vault',
    logout: 'Logout',

    // Home Page Hero & Telemetry
    systemOperational: 'SYSTEM OPERATIONAL',
    gpsAccuracy: 'GPS: ACCURACY 99.8%',
    encryption: 'ENCRYPTION: AES-256',
    nationalDispatch: 'NATIONAL DISPATCH: ACTIVE (999)',
    heroTitlePrefix: 'Instant Personal Safety &',
    heroTitleSuffix: 'Distress Telemetry Network',
    heroSub: 'SafeHaven is a mission-critical personal protection platform providing real-time SOS distress broadcasting, live GPS telemetry, and automated priority emergency dispatch.',
    createAccount: 'Create Free Account',
    emergencyDirectory: 'Emergency Directory',
    responseTime: 'Response Time',
    responseVal: '< 3.0 Seconds',
    priorityContactsSpec: 'Priority Contacts',
    priorityContactsVal: 'Up to 5 Persons',
    dispatchProtocol: 'Dispatch Protocol',
    dispatchVal: 'SMS + Webhook',

    // Panic Beacon Card
    panicBeacon: 'PANIC BEACON',
    sosDistressTrigger: 'SOS Distress Trigger',
    tapToTrigger: 'Tap button to open distress transmission sequence.',
    gpsTelemetry: 'GPS TELEMETRY',

    // Hotlines Section
    speedDialTitle: 'National Emergency Speed Dial',
    viewAllHotlines: 'View All Hotlines',
    nationalService: 'National Emergency Service',
    policeHelpline: 'Police Emergency Helpline',
    womenHelpline: 'National Women & Child Helpline',
    fireRescue: 'Fire Service & Rescue',
    ambulanceDispatch: 'Ambulance Emergency Dispatch',

    // Geolocation Radar
    monitoringRadar: 'Live Geolocation Monitoring Radar',

    // Capabilities Section
    systemCapabilities: 'System Capabilities',
    capabilitiesSub: 'Core safety mechanics engineered for minimal latency and high availability.',
    cap1Title: 'SOS Distress Broadcasting',
    cap1Desc: 'Dispatches multi-channel distress alerts containing real-time GPS coordinates to your 5 designated priority emergency contacts.',
    cap2Title: 'Priority Contact Management',
    cap2Desc: 'Store and manage emergency contacts with custom relationship tags, speed-dial links, and priority SMS notification rules.',
    cap3Title: 'Safety Operations Manual',
    cap3Desc: 'Comprehensive tactical self-defense strategies, travel security checklists, digital privacy guidelines, and legal rights handbook.',

    // Safety Tools
    fakeCall: 'FAKE CALL',
    sirenAlarm: 'LOUD SIREN ALARM',
    medicalID: 'MEDICAL ID',
    stopSiren: 'STOP SIREN (100dB)',
    fakeCallTitle: 'Fake Call Generator',
    editMedicalDetails: 'Edit Medical Details',
    saveMedicalID: 'Save Medical ID',
    close: 'Close',
    instantTools: 'Instant Safety Tools',
    instantToolsSub: 'Quick deterrence and escape utilities',

    // Emergency Help Page
    emergencyHelpTitle: 'Emergency Speed Dial & Safety Utilities',
    emergencyHelpSub: 'Tap any hotline to call emergency dispatch, or trigger tactile safety tools.',
    hotlinesDesk: 'Emergency Operations Desk',

    // Dashboard
    activeProtection: 'Active Protection',
    welcomeUser: 'Welcome',
    dashSub: 'Emergency telemetry active. Priority emergency contact(s) linked to your SOS beacon.',
    priorityContactsTitle: 'Priority Emergency Contacts',
    manage: 'Manage',
    recentLogs: 'Recent SOS Telemetry Logs',
    fullHistory: 'Full History Log',

    // SOS Modal
    sosActive: '🚨 SOS BROADCAST ACTIVE',
    sosActiveSub: 'Distress signal has been sent. Emergency contacts and command center have received your live location.',
    gpsCaptured: 'Live GPS Location Captured',
    call999: 'Call 999 Police Dispatch',
    markSafe: 'Mark Myself Safe & Resolve',
    openVault: 'OPEN EVIDENCE VAULT (RECORD AUDIO/VIDEO)',
    broadcastingIn: 'Broadcasting SOS in',
    cancelBroadcast: 'Cancel Broadcast',
    confirmSOS: 'Confirm Emergency SOS',
    confirmSub: 'This will transmit your live GPS location and alert all 5 emergency contacts immediately.',
    cancel: 'Cancel',

    // Footer
    footerDesc: 'Mission-critical personal safety platform providing distress broadcasting, continuous telemetry tracking, and rapid hotline routing.',
    footerHotlines: 'Hotlines',
    footerTelemetry: 'Telemetry Specs',
    footerSecurity: 'Location telemetry is encrypted end-to-end and transmitted solely during authorized SOS distress events to designated emergency contacts.',
    allRightsReserved: 'SafeHaven Systems Inc. All rights reserved.',
    supportLink: 'Support',
    securityProtocolLink: 'Security Protocol'
  },
  bn: {
    // Navbar & Brand
    brandName: 'সেফহেভেন',
    onlineStatus: 'অনলাইন',
    signIn: 'সাইন ইন',
    getStarted: 'শুরু করুন',
    sosDispatch: 'জরুরি এসওএস',
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    features: 'ফিচারসমূহ',
    safetyTips: 'নিরাপত্তা টিপস',
    emergencyHelp: 'জরুরি সহায়তা',
    blog: 'ব্লগ',
    contact: 'যোগাযোগ',
    dashboard: 'ড্যাশবোর্ড',
    profile: 'প্রোফাইল',
    emergencyContacts: 'জরুরি পরিচিতি',
    sosHistory: 'এসওএস ইতিহাস',
    liveLocation: 'লাইভ লোকেশন',
    notifications: 'নোটিফিকেশন',
    settings: 'সেটিংস',
    evidenceVault: 'প্রমাণ সংরক্ষণাগার',
    logout: 'লগআউট',

    // Home Page Hero & Telemetry
    systemOperational: 'সিস্টেম সক্রিয়',
    gpsAccuracy: 'জিপিএস সঠিকতা: ৯৯.৮%',
    encryption: 'এনক্রিপশন: এইএস-২৫৬',
    nationalDispatch: 'জাতীয় জরুরি সেবা: সক্রিয় (৯৯৯)',
    heroTitlePrefix: 'তাৎক্ষণিক ব্যক্তিগত নিরাপত্তা ও',
    heroTitleSuffix: 'জরুরি সংকেত নেটওয়ার্ক',
    heroSub: 'সেফহেভেন একটি অত্যন্ত জরুরি ব্যক্তিগত সুরক্ষা প্ল্যাটফর্ম যা রিয়েল-টাইম এসওএস সংকেত প্রচার, লাইভ জিপিএস লোকেশন এবং স্বয়ংক্রিয় জরুরি সহায়তা প্রদান করে।',
    createAccount: 'বিনামূল্যে অ্যাকাউন্ট খুলুন',
    emergencyDirectory: 'জরুরি সহায়তার তালিকা',
    responseTime: 'প্রতিক্রিয়ার সময়',
    responseVal: '< ৩.০ সেকেন্ড',
    priorityContactsSpec: 'জরুরি পরিচিতি',
    priorityContactsVal: 'সর্বোচ্চ ৫ জন',
    dispatchProtocol: 'সংকেত প্রেরণের মাধ্যম',
    dispatchVal: 'এসএমএস + ওয়েবহুক',

    // Panic Beacon Card
    panicBeacon: 'প্যানিক বিকন',
    sosDistressTrigger: 'এসওএস জরুরি ট্রিগার',
    tapToTrigger: 'জরুরি সংকেত পাঠানোর জন্য বোতামে চাপ দিন।',
    gpsTelemetry: 'জিপিএস লোকেশন সংকেত',

    // Hotlines Section
    speedDialTitle: 'জাতীয় জরুরি স্পিড ডায়াল',
    viewAllHotlines: 'সকল নম্বর দেখুন',
    nationalService: 'জাতীয় জরুরি সেবা',
    policeHelpline: 'পুলিশ জরুরি হেল্পলাইন',
    womenHelpline: 'জাতীয় নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন',
    fireRescue: 'ফায়ার সার্ভিস ও উদ্ধার সেবা',
    ambulanceDispatch: 'অ্যাম্বুলেন্স জরুরি সেবা',

    // Geolocation Radar
    monitoringRadar: 'লাইভ লোকেশন মনিটরিং রাডার',

    // Capabilities Section
    systemCapabilities: 'সিস্টেমের সুবিধাসমূহ',
    capabilitiesSub: 'অত্যন্ত দ্রুত সাড়া দেওয়ার জন্য বিশেষভাবে তৈরি সুরক্ষা মেকানিক্স।',
    cap1Title: 'এসওএস জরুরি বার্তা প্রচার',
    cap1Desc: 'আপনার পছন্দের ৫ জন জরুরি পরিচিতির কাছে রিয়েল-টাইম জিপিএস লোকেশন সহ জরুরি বার্তা পাঠায়।',
    cap2Title: 'জরুরি পরিচিতি ব্যবস্থাপনা',
    cap2Desc: 'জরুরি পরিচিতিদের তথ্য, স্পিড ডায়াল লিঙ্ক এবং অগ্রাধিকার ভিত্তিক এসএমএস রুলস সংরক্ষণ করুন।',
    cap3Title: 'নিরাপত্তা নির্দেশিকা ও ম্যানুয়াল',
    cap3Desc: 'আত্মরক্ষা কৌশল, ভ্রমণ নিরাপত্তা চেকলিস্ট, ডিজিটাল প্রাইভেসী গাইডলাইন এবং আইনি অধিকার বুকলেট।',

    // Safety Tools
    fakeCall: 'ফেক কল',
    sirenAlarm: 'সাইরেন অ্যালার্ম',
    medicalID: 'মেডিকেল আইডি',
    stopSiren: 'সাইরেন বন্ধ করুন (১০০ডিবি)',
    fakeCallTitle: 'ফেক কল জেনারেটর',
    editMedicalDetails: 'মেডিকেল তথ্য পরিবর্তন করুন',
    saveMedicalID: 'মেডিকেল আইডি সংরক্ষণ করুন',
    close: 'বন্ধ করুন',
    instantTools: 'তাৎক্ষণিক নিরাপত্তা টুলস',
    instantToolsSub: 'দ্রুত বিপদ থেকে আত্মরক্ষার জন্য বিশেষ সহায়িকা',

    // Emergency Help Page
    emergencyHelpTitle: 'জরুরি স্পিড ডায়াল ও নিরাপত্তা টুলস',
    emergencyHelpSub: 'যেকোনো নম্বরে চাপ দিয়ে সরাসরি কল করুন অথবা নিরাপত্তা টুলস চালু করুন।',
    hotlinesDesk: 'জরুরি অপারেটর ডেস্ক',

    // Dashboard
    activeProtection: 'সুরক্ষা সক্রিয়',
    welcomeUser: 'স্বাগতম',
    dashSub: 'জরুরি লোকেশন সংকেত সক্রিয় রয়েছে। আপনার এসওএস বিকনে অগ্রাধিকারের পরিচিতিরা যুক্ত আছেন।',
    priorityContactsTitle: 'জরুরি পরিচিতি তালিকা',
    manage: 'পরিচালনা করুন',
    recentLogs: 'সাম্প্রতিক এসওএস রেকর্ড',
    fullHistory: 'সম্পূর্ণ ইতিহাস দেখুন',

    // SOS Modal
    sosActive: '🚨 এসওএস সংকেত সক্রিয়',
    sosActiveSub: 'জরুরি সংকেত পাঠানো হয়েছে। আপনার জরুরি পরিচিতি ও কমান্ট সেন্টার লাইভ লোকেশন পেয়েছে।',
    gpsCaptured: 'লাইভ জিপিএস অবস্থান সংরক্ষণ করা হয়েছে',
    call999: '৯৯৯ পুলিশ জরুরি সেবায় কল করুন',
    markSafe: 'আমি নিরাপদ আছি & সমাধান করুন',
    openVault: 'প্রমাণ সংরক্ষণাগার খুলুন (অডিও/ভিডিও রেকর্ড)',
    broadcastingIn: 'এসওএস সংকেত পাঠানো হচ্ছে',
    cancelBroadcast: 'সংকেত বাতিল করুন',
    confirmSOS: 'জরুরি এসওএস নিশ্চিত করুন',
    confirmSub: 'এটি আপনার লাইভ জিপিএস অবস্থান ৫ জন জরুরি পরিচিতির কাছে তাৎক্ষণিকভাবে পাঠাবে।',
    cancel: 'বাতিল করুন',

    // Footer
    footerDesc: 'জরুরি বার্তা প্রচার, অব্যাহত জিপিএস ট্র্যাকিং এবং দ্রুত হেল্পলাইন রাউটিং সহ জরুরি নিরাপত্তা প্ল্যাটফর্ম।',
    footerHotlines: 'জরুরি নম্বরসমূহ',
    footerTelemetry: 'নিরাপত্তা তথ্য',
    footerSecurity: 'অবস্থান ডেটা এনক্রিপ্ট করা থাকে এবং শুধুমাত্র অনুমতি প্রাপ্ত জরুরি ইভেন্টে পাঠানো হয়।',
    allRightsReserved: 'সেফহেভেন সিস্টেমস। সর্বস্বত্ব সংরক্ষিত।',
    supportLink: 'সহায়তা',
    securityProtocolLink: 'নিরাপত্তা প্রোটোকল'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('safehaven_lang');
    return saved ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('safehaven_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
