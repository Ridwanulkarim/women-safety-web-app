import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar & Common
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

    // Home Page
    systemOperational: 'SYSTEM OPERATIONAL',
    gpsAccuracy: 'GPS: ACCURACY 99.8%',
    encryption: 'ENCRYPTION: AES-256',
    nationalDispatch: 'NATIONAL DISPATCH: ACTIVE (999)',
    heroTitlePrefix: 'Instant Personal Safety &',
    heroTitleSuffix: 'Distress Telemetry Network',
    heroSub: 'SafeHaven is a mission-critical personal protection platform providing real-time SOS distress broadcasting, live GPS telemetry, and automated priority emergency dispatch.',
    createAccount: 'Create Free Account',
    emergencyDirectory: 'Emergency Directory',
    panicBeacon: 'PANIC BEACON',
    sosDistressTrigger: 'SOS Distress Trigger',
    tapToTrigger: 'Tap button to open distress transmission sequence.',
    speedDialTitle: 'National Emergency Speed Dial',
    viewAllHotlines: 'View All Hotlines',
    monitoringRadar: 'Live Geolocation Monitoring Radar',
    systemCapabilities: 'System Capabilities',

    // Safety Tools
    fakeCall: 'FAKE CALL',
    sirenAlarm: 'LOUD SIREN ALARM',
    medicalID: 'MEDICAL ID',
    stopSiren: 'STOP SIREN (100dB)',
    fakeCallTitle: 'Fake Call Generator',
    editMedicalDetails: 'Edit Medical Details',
    saveMedicalID: 'Save Medical ID',
    close: 'Close',

    // Dashboard
    activeProtection: 'Active Protection',
    welcomeBack: 'Welcome',
    priorityContacts: 'Priority Emergency Contacts',
    recentSOSLogs: 'Recent SOS Telemetry Logs',
    manageContacts: 'Manage'
  },
  bn: {
    // Navbar & Common
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

    // Home Page
    systemOperational: 'সিস্টেম সক্রিয়',
    gpsAccuracy: 'জিপিএস সঠিকতা: ৯৯.৮%',
    encryption: 'এনক্রিপশন: এইএস-২৫৬',
    nationalDispatch: 'জাতীয় জরুরি সেবা: সক্রিয় (৯৯৯)',
    heroTitlePrefix: 'তাৎক্ষণিক ব্যক্তিগত নিরাপত্তা ও',
    heroTitleSuffix: 'জরুরি সংকেত নেটওয়ার্ক',
    heroSub: 'সেফহেভেন একটি অত্যন্ত জরুরি ব্যক্তিগত সুরক্ষা প্ল্যাটফর্ম যা রিয়েল-টাইম এসওএস সংকেত প্রচার, লাইভ জিপিএস লোকেশন এবং স্বয়ংক্রিয় জরুরি সহায়তা প্রদান করে।',
    createAccount: 'বিনামূল্যে অ্যাকাউন্ট খুলুন',
    emergencyDirectory: 'জরুরি ডিরেক্টরি',
    panicBeacon: 'প্যানিক বিকন',
    sosDistressTrigger: 'এসওএস জরুরি ট্রিগার',
    tapToTrigger: 'জরুরি সংকেত পাঠানোর জন্য বোতামে চাপ দিন।',
    speedDialTitle: 'জাতীয় জরুরি স্পিড ডায়াল',
    viewAllHotlines: 'সকল নম্বর দেখুন',
    monitoringRadar: 'লাইভ লোকেশন মনিটরিং রাডার',
    systemCapabilities: 'সিস্টেমের সুবিধাসমূহ',

    // Safety Tools
    fakeCall: 'ফেক কল',
    sirenAlarm: 'সাইরেন অ্যালার্ম',
    medicalID: 'মেডিকেল আইডি',
    stopSiren: 'সাইরেন বন্ধ করুন (১০০ডিবি)',
    fakeCallTitle: 'ফেক কল জেনারেটর',
    editMedicalDetails: 'মেডিকেল তথ্য পরিবর্তন করুন',
    saveMedicalID: 'মেডিকেল আইডি সংরক্ষণ করুন',
    close: 'বন্ধ করুন',

    // Dashboard
    activeProtection: 'সুরক্ষা সক্রিয়',
    welcomeBack: 'স্বাগতম',
    priorityContacts: 'জরুরি পরিচিতি তালিকা',
    recentSOSLogs: 'সাম্প্রতিক এসওএস রেকর্ড',
    manageContacts: 'পরিচালনা করুন'
  }
};

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
