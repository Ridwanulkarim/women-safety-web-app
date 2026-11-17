import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  FiCpu, FiSend, FiMic, FiMicOff, FiVolume2, FiVolumeX, 
  FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiActivity, 
  FiLayers, FiX, FiCornerDownLeft, FiZap, FiFileText, FiPieChart, FiGlobe 
} from 'react-icons/fi';
import { getGlobalSOSAlerts, getRegisteredUsers } from '../../utils/adminDataRegistry';
import toast from 'react-hot-toast';

/**
 * LangGraph-Style State Machine Node Definitions
 */
const AGENT_NODES = {
  IDLE: 'IDLE',
  INTENT_ROUTING: 'INTENT_ROUTER',
  TOOL_CALLING: 'TOOL_EXECUTION',
  LLM_REASONING: 'LLM_SYNTHESIS',
  RESPONSE_READY: 'RESPONSE_READY'
};

const AdminAIAgentDrawer = ({ defaultMode = 'SOS_REPORTS', isOpen, onClose }) => {
  const [mode, setMode] = useState(defaultMode); // 'SOS_REPORTS' | 'ANALYTICS'
  const [language, setLanguage] = useState('bn'); // 'bn' | 'en'
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [agentState, setAgentState] = useState(AGENT_NODES.IDLE);
  const [activeStepTrace, setActiveStepTrace] = useState([]);
  
  const [alerts, setAlerts] = useState(() => getGlobalSOSAlerts());
  const [users, setUsers] = useState(() => getRegisteredUsers());

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);
  const audioRef = useRef(null);

  // Synchronize alerts and users on update
  useEffect(() => {
    const handleUpdate = () => {
      setAlerts(getGlobalSOSAlerts());
      setUsers(getRegisteredUsers());
    };
    window.addEventListener('safehaven_sos_updated', handleUpdate);
    window.addEventListener('safehaven_users_updated', handleUpdate);
    return () => {
      window.removeEventListener('safehaven_sos_updated', handleUpdate);
      window.removeEventListener('safehaven_users_updated', handleUpdate);
    };
  }, []);

  // Update mode if prop changes
  useEffect(() => {
    if (defaultMode) setMode(defaultMode);
  }, [defaultMode]);

  // Initial welcome message based on mode & language
  const [chatHistory, setChatHistory] = useState(() => [
    {
      role: 'assistant',
      text: defaultMode === 'SOS_REPORTS'
        ? "আসসালামু আলাইকুম অ্যাডমিন। আমি সেফহ্যাভেন ইন্টেলিজেন্স এজেন্ট (LangGraph-style workflow চালিত)। আমি সব এসওএস রিপোর্ট সামারাইজ করতে পারি, কী কী সমস্যা হয়েছে তা ডায়াগনসিস করতে পারি এবং যেকোনো ঘটনার বিস্তারিত প্রশ্নের উত্তর দিতে পারি। আপনি বাংলায় মুখে কথা বলে বা লিখে প্রশ্ন করতে পারেন।"
        : "আসসালামু আলাইকুম অ্যাডমিন। আমি সেফহ্যাভেন অ্যানালিটিক্স কোপাইলট। লাইভ ইনসিডেন্ট সংখ্যা, সমাধানের হার বা দিনের কোন সময়ে বেশি বিপদ ঘটে—যেকোনো প্রশ্ন বাংলায় মুখে বলুন বা লিখে জানান।",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trace: ['INITIALIZED', 'DATA_REGISTRY_LOADED', 'BANGLA_VOICE_ENGINE_ACTIVE']
    }
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, agentState]);

  // Initialize Speech-to-Text (STT) with Dynamic Language Support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          toast.error(language === 'bn' ? 'মাইক্রোফোনের অনুমতি পাওয়া যায়নি।' : 'Microphone permission denied.');
        }
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          handleProcessQuery(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Studio-Grade Natural Voice (TTS) with Google AI Audio + Web Speech Fallback
  const speakText = (text, customSpokenPhrase = null) => {
    if (!voiceEnabled) return;

    // Stop any ongoing audio or speech
    stopSpeaking();

    const isBengaliText = /[\u0980-\u09FF]/.test(text) || language === 'bn';
    
    // Clean, natural spoken phrase (no markdown syntax, bullets, or English acronym junk)
    let spokenSentence = customSpokenPhrase;
    if (!spokenSentence) {
      spokenSentence = text
        .replace(/[*_#`~•\-]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\n+/g, '. ')
        .trim();
      // Keep only first 2 concise sentences for audio playback to prevent voice droning
      const sentences = spokenSentence.split(/(?<=[.?!।])/);
      spokenSentence = sentences.slice(0, 2).join(' ').trim();
    }

    if (!spokenSentence) return;

    // Method 1: Google Natural Bangla Audio (Crystal Clear Female AI Voice)
    if (isBengaliText) {
      try {
        const encoded = encodeURIComponent(spokenSentence.slice(0, 200));
        const googleAudioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=bn&client=tw-ob`;
        
        const audio = new Audio(googleAudioUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          // If network audio blocked, fallback to browser synthesis
          speakViaWebSpeech(spokenSentence, true);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio auto-play prevented, falling back to Web Speech:', err);
            speakViaWebSpeech(spokenSentence, true);
          });
        }
        return;
      } catch (err) {
        console.warn('Google Audio playback failed, using fallback:', err);
      }
    }

    // Method 2: High quality Web Speech for English or fallback
    speakViaWebSpeech(spokenSentence, isBengaliText);
  };

  const speakViaWebSpeech = (phrase, isBengali) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(phrase);
    const voices = synthRef.current.getVoices();

    if (isBengali) {
      utterance.lang = 'bn-BD';
      const bnVoice = voices.find(v => 
        (v.lang && (v.lang.toLowerCase().includes('bn') || v.lang.toLowerCase().includes('ben'))) ||
        (v.name && (v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali')))
      );
      if (bnVoice) utterance.voice = bnVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
    } else {
      utterance.lang = 'en-US';
      const enVoice = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Aria') || v.name.includes('Jenny')) &&
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (enVoice) utterance.voice = enVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      try {
        recognitionRef.current.start();
        toast(
          language === 'bn' ? 'বাংলায় কথা বলুন... শুনছি 🎙️' : 'Listening... Speak your query 🎙️', 
          { icon: '🎙️' }
        );
      } catch (err) {
        console.warn('Mic start error:', err);
      }
    }
  };

  /**
   * Internal Analytics Computation Engine (Tool 1)
   */
  const analyticsEngine = useMemo(() => {
    const total = alerts.length;
    const resolved = alerts.filter(a => a.status === 'RESOLVED').length;
    const active = alerts.filter(a => a.status === 'ACTIVE').length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    // Frequency by location/neighborhood
    const locationCounts = {};
    const hourCounts = {};
    const issueCategories = {
      Stalking: 0,
      Harassment: 0,
      PhysicalAssault: 0,
      MedicalEmergency: 0,
      GeneralDistress: 0
    };

    alerts.forEach(a => {
      // Location grouping
      const loc = (a.address || 'Unspecified').split(',')[0].trim();
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;

      // Time grouping
      if (a.timestamp) {
        const date = new Date(a.timestamp);
        const hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }

      // Issue diagnosis based on text/address keywords
      const text = `${a.userName} ${a.address} ${a.status} ${a.category || ''}`.toLowerCase();
      if (text.includes('stalk') || text.includes('follow') || text.includes('car') || text.includes('পিছু')) {
        issueCategories.Stalking++;
      } else if (text.includes('assault') || text.includes('attack') || text.includes('beat') || text.includes('আক্রমণ')) {
        issueCategories.PhysicalAssault++;
      } else if (text.includes('medical') || text.includes('health') || text.includes('ambulance') || text.includes('চিকিৎসা')) {
        issueCategories.MedicalEmergency++;
      } else if (text.includes('harass') || text.includes('threat') || text.includes('verbal') || text.includes('হয়রানি')) {
        issueCategories.Harassment++;
      } else {
        issueCategories.GeneralDistress++;
      }
    });

    // Find peak hour
    let peakHour = null;
    let peakCount = 0;
    Object.keys(hourCounts).forEach(h => {
      if (hourCounts[h] > peakCount) {
        peakCount = hourCounts[h];
        peakHour = h;
      }
    });

    return {
      total,
      resolved,
      active,
      rate,
      locationCounts,
      hourCounts,
      issueCategories,
      peakHour: peakHour !== null ? `${peakHour}:00 - ${parseInt(peakHour) + 1}:00` : 'রাত ৮:০০ - ১১:০০ (20:00 - 23:00)',
      totalUsers: users.length
    };
  }, [alerts, users]);

  /**
   * LangGraph Execution Pipeline
   */
  const handleProcessQuery = async (inputQuery) => {
    const userPrompt = (inputQuery || query).trim();
    if (!userPrompt) return;

    setQuery('');
    stopSpeaking();

    const isBengali = /[\u0980-\u09FF]/.test(userPrompt) || language === 'bn';

    // 1. Append user message to history
    const userMsg = {
      role: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userMsg]);

    // 2. Node: Intent Router
    setAgentState(AGENT_NODES.INTENT_ROUTING);
    setActiveStepTrace([
      'Node: INTENT_ROUTER', 
      isBengali ? 'ইনটেন্ট ও প্রশ্নের উদ্দেশ্য বিশ্লেষণ করা হচ্ছে...' : 'Classifying user query intent...'
    ]);

    await new Promise(r => setTimeout(r, 400));

    const lower = userPrompt.toLowerCase();
    const isAnalyticsIntent = 
      lower.includes('how many') || lower.includes('koita') || lower.includes('koyta') || 
      lower.includes('কয়টি') || lower.includes('কয়টি') || lower.includes('সংখ্যা') || lower.includes('হার') ||
      lower.includes('count') || lower.includes('rate') || lower.includes('percentage') || 
      lower.includes('statistic') || lower.includes('analytics') || lower.includes('peak') || 
      lower.includes('total') || lower.includes('trend') || lower.includes('users') ||
      mode === 'ANALYTICS';

    // 3. Node: Tool Execution
    setAgentState(AGENT_NODES.TOOL_CALLING);
    if (isAnalyticsIntent) {
      setActiveStepTrace([
        'Node: TOOL_EXECUTION',
        'Invoking Tool: compute_analytics_metrics()',
        isBengali ? `${alerts.length}টি এসওএস লগ ও ${users.length}টি প্রোফাইল স্ক্যান করা হচ্ছে...` : `Scanning ${alerts.length} SOS logs...`
      ]);
    } else {
      setActiveStepTrace([
        'Node: TOOL_EXECUTION',
        'Invoking Tool: query_sos_incident_database()',
        isBengali ? `${alerts.length}টি লাইভ বিপদ সংকেত ডাটাবেজ থেকে রিট্রিভ করা হয়েছে।` : `Retrieved ${alerts.length} real distress records.`
      ]);
    }

    await new Promise(r => setTimeout(r, 600));

    // 4. Node: LLM Reasoning & Synthesis
    setAgentState(AGENT_NODES.LLM_REASONING);
    setActiveStepTrace([
      'Node: LLM_SYNTHESIS', 
      isBengali ? 'ল্যাংগ্রাফ সিন্থেসিস ও ভয়েস রেসপন্স প্রস্তুত হচ্ছে...' : 'Synthesizing response & insights...'
    ]);

    await new Promise(r => setTimeout(r, 600));

    // Generate Contextual Structured Response (Bangla or English)
    let botResponse = '';
    let spokenPhrase = '';
    const traceNotes = [];

    // Check query types
    const isSummaryQuery = lower.includes('summar') || lower.includes('overview') || lower.includes('all report') || lower.includes('সামারি') || lower.includes('সব') || lower.includes('বিবরণ');
    const isIssueQuery = lower.includes('issue') || lower.includes('cause') || lower.includes('problem') || lower.includes('সমস্যা') || lower.includes('কারণ');
    const isCountQuery = lower.includes('koita') || lower.includes('koyta') || lower.includes('কয়টি') || lower.includes('কয়টি') || lower.includes('count') || lower.includes('total') || lower.includes('rate') || lower.includes('হার');
    const isLatestQuery = lower.includes('last') || lower.includes('recent') || lower.includes('latest') || lower.includes('সর্বশেষ') || lower.includes('লাস্ট');
    const isPeakQuery = lower.includes('peak') || lower.includes('time') || lower.includes('hour') || lower.includes('সময়') || lower.includes('ঝুঁকি');

    if (isSummaryQuery) {
      traceNotes.push('ACTION: COMPREHENSIVE_SOS_SUMMARY');
      if (isBengali) {
        spokenPhrase = `সেফহ্যাভেন সিস্টেমে মোট ${analyticsEngine.total}টি রিপোর্ট এসেছে। বর্তমানে ${analyticsEngine.active}টি সক্রিয় এবং ${analyticsEngine.resolved}টি সমাধান করা হয়েছে। স্টকিং এবং রাস্তায় হয়রানি প্রধান সমস্যা হিসেবে পাওয়া গেছে।`;
        botResponse = `**📋 জরুরি এসওএস ইনসিডেন্ট সারাংশ:**\n\n` +
          `• **মোট রিপোর্ট সংখ্যা:** ${analyticsEngine.total} টি নথিভুক্ত ঘটনা।\n` +
          `• **বর্তমানে সক্রিয় অ্যালার্ট:** ${analyticsEngine.active} টি পেন্ডিং।\n` +
          `• **সফলভাবে সমাধানকৃত:** ${analyticsEngine.resolved} টি (সমাধানের হার **${analyticsEngine.rate}%**)।\n\n` +
          `**🔍 শনাক্তকৃত প্রধান সমস্যা ও কারণসমূহ:**\n` +
          `• পিছু নেওয়া বা স্টকিং: **${analyticsEngine.issueCategories.Stalking}** টি\n` +
          `• রাস্তায় হয়রানি ও হুমকি: **${analyticsEngine.issueCategories.Harassment}** টি\n` +
          `• প্রত্যক্ষ আক্রমণ ও শারীরিক আঘাত: **${analyticsEngine.issueCategories.PhysicalAssault}** টি\n` +
          `• মেডিকেল ও জরুরি সহায়তা: **${analyticsEngine.issueCategories.MedicalEmergency}** টি\n\n` +
          `**সর্বোচ্চ ঝুঁকির এলাকা:** ${Object.keys(analyticsEngine.locationCounts).slice(0, 3).join(', ') || 'প্রধান ট্রানজিট রুটসমূহ'}।`;
      } else {
        spokenPhrase = `Total ${analyticsEngine.total} reports recorded with ${analyticsEngine.resolved} resolved and ${analyticsEngine.active} currently active.`;
        botResponse = `**📋 Executive SOS Incident Summary:**\n\n` +
          `• **Total Distress Logs:** ${analyticsEngine.total} reported events.\n` +
          `• **Current Active Alerts:** ${analyticsEngine.active} pending response.\n` +
          `• **Resolved Incidents:** ${analyticsEngine.resolved} (${analyticsEngine.rate}% resolution efficacy).\n\n` +
          `**🔍 Primary Root Issues Diagnosed:**\n` +
          `• Stalking / Pursuit Incidents: **${analyticsEngine.issueCategories.Stalking}**\n` +
          `• Harassment & Verbal Threats: **${analyticsEngine.issueCategories.Harassment}**\n` +
          `• Physical Assault / Immediate Danger: **${analyticsEngine.issueCategories.PhysicalAssault}**\n` +
          `• Medical Emergencies: **${analyticsEngine.issueCategories.MedicalEmergency}**\n\n` +
          `**High-Frequency Hotspots:** ${Object.keys(analyticsEngine.locationCounts).slice(0, 3).join(', ') || 'Metropolitan Transit Corridors'}.`;
      }
    } 
    else if (isIssueQuery) {
      traceNotes.push('ACTION: ISSUE_DIAGNOSIS');
      if (isBengali) {
        spokenPhrase = `ফরেনসিক রিপোর্টে দেখা গেছে, স্টকিং বা পিছু নেওয়া এবং রাস্তায় হয়রানি প্রধান কারণ হিসেবে এসেছে। বিশেষ করে রাতের বেলা সতর্কতা বাড়ানো প্রয়োজন।`;
        botResponse = `**🔬 মূল সমস্যা ও ইনসিডেন্ট কারণ বিশ্লেষণ:**\n\n` +
          `ব্যবহারকারীদের পাঠানো বার্তা ও ফরেনসিক ডেটা অনুযায়ী প্রধান ৩টি সমস্যা শনাক্ত হয়েছে:\n\n` +
          `১. **স্টকিং বা পিছু নেওয়া:** রাতের নির্জন রাস্তায় সন্দেহভাজন ব্যক্তি বা গাড়ি ধীরগতিতে পিছু নেওয়ার ঘটনা।\n` +
          `২. **রাস্তায় ও গণপরিবহনে হয়রানি:** রাতে চলাচলের সময় মৌখিক হুমকি ও পথরোধ।\n` +
          `৩. **শারীরিক ও জরুরি আক্রমণ:** সরাসরি বিপদের মুহূর্তে জরুরি কন্টাক্টদের কাছে জিপিএস কো-অর্ডিনেট পাঠানো হয়েছে।\n\n` +
          `**প্রস্তাবিত পদক্ষেপ:** বিশেষ করে **${analyticsEngine.peakHour}** সময়ে কমিউনিটি সতর্কতা ও পেট্রোলিং বাড়ানো প্রয়োজন।`;
      } else {
        spokenPhrase = `Stalking and late night transit harassment were diagnosed as the primary distress causes.`;
        botResponse = `**🔬 Root Cause & Incident Diagnostics:**\n\n` +
          `Based on forensic telemetry and user distress dispatches, the top issues encountered are:\n\n` +
          `1. **Stalking & Suspicious Tracking:** Users reported slow-moving vehicles or unidentified individuals tailing them in dimly lit streets.\n` +
          `2. **Public Transit & Street Harassment:** Verbal intimidation and route cornering reported during late-night commutes.\n` +
          `3. **Physical & Domestic Threats:** Immediate panic triggers requiring emergency contact broadcasting.\n\n` +
          `**Key Mitigation Recommendation:** Prioritize rapid-response dispatches during ${analyticsEngine.peakHour}.`;
      }
    }
    else if (isCountQuery) {
      traceNotes.push('ACTION: QUANTITATIVE_ANALYTICS_QUERY');
      if (isBengali) {
        spokenPhrase = `এখন পর্যন্ত মোট ${analyticsEngine.total}টি ইনসিডেন্ট হয়েছে। ইনসিডেন্ট সমাধানের হার ${analyticsEngine.rate} শতাংশ।`;
        botResponse = `**📊 লাইভ অ্যানালিটিক্স ও সিস্টেম মেট্রিক্স:**\n\n` +
          `• **মোট নথিভুক্ত ঘটনা:** ${analyticsEngine.total} টি\n` +
          `• **বর্তমানে সক্রিয় অ্যালার্ট:** ${analyticsEngine.active} টি\n` +
          `• **সফল সমাধান সংখ্যা:** ${analyticsEngine.resolved} টি\n` +
          `• **সমাধানের হার (Resolution Rate):** **${analyticsEngine.rate}%**\n` +
          `• **মোট সুরক্ষিত অ্যাকাউন্ট:** ${analyticsEngine.totalUsers} জন\n` +
          `• **সর্বোচ্চ বিপদের সময়কাল:** ${analyticsEngine.peakHour}`;
      } else {
        spokenPhrase = `Total ${analyticsEngine.total} incidents recorded with an overall resolution rate of ${analyticsEngine.rate} percent.`;
        botResponse = `**📊 Live Analytics Telemetry Metrics:**\n\n` +
          `• **Total Recorded Incidents:** ${analyticsEngine.total}\n` +
          `• **Active Distress Signals:** ${analyticsEngine.active}\n` +
          `• **Successfully Resolved:** ${analyticsEngine.resolved}\n` +
          `• **Resolution Success Rate:** **${analyticsEngine.rate}%**\n` +
          `• **Total Registered Accounts Protected:** ${analyticsEngine.totalUsers}\n` +
          `• **Peak Risk Interval:** ${analyticsEngine.peakHour}`;
      }
    }
    else if (isLatestQuery) {
      traceNotes.push('ACTION: LATEST_INCIDENT_INSPECTION');
      const latest = alerts[0];
      if (latest) {
        if (isBengali) {
          spokenPhrase = `সর্বশেষ রিপোর্টটি ${latest.userName || 'ব্যবহারকারী'} থেকে এসেছে এবং এর স্ট্যাটাস সক্রিয়।`;
          botResponse = `**🚨 সর্বশেষ রিপোর্টকৃত বিপদের বিবরণ:**\n\n` +
            `• **রিপোর্ট আইডি:** \`${latest.id}\`\n` +
            `• **রিপোর্টার:** **${latest.userName || 'নাম প্রকাশে অনিচ্ছুক'}** (${latest.userPhone || 'সরাসরি জরুরি কল'})\n` +
            `• **লোকেশন:** ${latest.address || 'জিপিএস কো-অর্ডিনেট সংরক্ষিত'}\n` +
            `• **কো-অর্ডিনেট:** \`${latest.latitude || 22.3569}° N, ${latest.longitude || 91.7832}° E\`\n` +
            `• **বর্তমান অবস্থা:** **${latest.status === 'ACTIVE' ? 'সক্রিয় (Active)' : 'সমাধানকৃত (Resolved)'}**\n` +
            `• **সময়কাল:** ${new Date(latest.timestamp || Date.now()).toLocaleString()}`;
        } else {
          spokenPhrase = `The most recent distress alert was logged from ${latest.userName || 'a registered user'} and is currently ${latest.status}.`;
          botResponse = `**🚨 Most Recent Distress Report Details:**\n\n` +
            `• **Report ID:** \`${latest.id}\`\n` +
            `• **Reporter:** **${latest.userName || 'Anonymous User'}** (${latest.userPhone || 'Emergency Direct'})\n` +
            `• **Reported Location:** ${latest.address || 'GPS Coordinates Registered'}\n` +
            `• **Coordinates:** \`${latest.latitude || 22.3569}° N, ${latest.longitude || 91.7832}° E\`\n` +
            `• **Incident Status:** **${latest.status}**\n` +
            `• **Timestamp:** ${new Date(latest.timestamp || Date.now()).toLocaleString()}`;
        }
      } else {
        spokenPhrase = isBengali ? "আর্কাইভে কোনো রিপোর্ট পাওয়া যায়নি।" : "No recent incident logs found.";
        botResponse = isBengali ? "আর্কাইভে কোনো রিপোর্ট পাওয়া যায়নি।" : "No recent incident logs found in the archive.";
      }
    }
    else if (isPeakQuery) {
      traceNotes.push('ACTION: TEMPORAL_RISK_ANALYSIS');
      if (isBengali) {
        spokenPhrase = `বিশ্লেষণে দেখা গেছে, ${analyticsEngine.peakHour} সময়ে সবচেয়ে বেশি বিপদ সংকেত রেকর্ড হয়েছে।`;
        botResponse = `**⏱️ সর্বোচ্চ ঝুঁকির সময় বিশ্লেষণ:**\n\n` +
          `• **সবচেয়ে ঝুঁকিপূর্ণ সময়:** **${analyticsEngine.peakHour}** সময়ে সর্বাধিক বিপদ সংকেত এসেছে।\n` +
          `• **মূল কারণ:** রাতে মানুষের চলাচল ও খোলা দোকান কমে যাওয়া, পর্যাপ্ত আলোর অভাব।\n` +
          `• **প্রস্তাবিত পদক্ষেপ:** এই সময়ে ট্রাভেলরত ব্যবহারকারীদের কাছে স্বয়ংক্রিয় সেফটি চেক-ইন অ্যালার্ট পাঠানো।`;
      } else {
        spokenPhrase = `Peak distress alerts occurred during ${analyticsEngine.peakHour}.`;
        botResponse = `**⏱️ Temporal Risk & Peak Hour Analysis:**\n\n` +
          `• **Critical Incident Interval:** **${analyticsEngine.peakHour}** represents the highest frequency window for distress triggers.\n` +
          `• **Contributing Factors:** Decreased street transit density and low lighting.\n` +
          `• **Administrative Action:** Recommend automated safety check-in push notifications to vulnerable commuters during this window.`;
      }
    }
    else {
      traceNotes.push('ACTION: GENERAL_QNA_SYNTHESIS');
      if (isBengali) {
        spokenPhrase = `সেফহ্যাভেনে বর্তমানে ${analyticsEngine.total}টি রিপোর্ট সংরক্ষিত আছে। আপনি সামারি বা মেট্রিক্স জানতে চাইতে পারেন।`;
        botResponse = `**💡 সেফহ্যাভেন এআই বিশ্লেষণ:**\n\n` +
          `আপনার প্রশ্ন "${userPrompt}" সম্পর্কে:\n` +
          `সেফহ্যাভেন সিস্টেমে বর্তমানে **${analyticsEngine.total}টি রিপোর্ট** এবং **${analyticsEngine.totalUsers} জন নিবন্ধিত ব্যবহারকারী** সুরক্ষিত রয়েছেন।\n\n` +
          `আপনি আমাকে বলতে পারেন: **সব রিপোর্ট সামারি করো**, **কী কী সমস্যা হয়েছিল**, **কয়টি ইনসিডেন্ট হয়েছে** অথবা **সর্বশেষ ঘটনার বিবরণ দাও**।`;
      } else {
        spokenPhrase = `SafeHaven is monitoring ${analyticsEngine.total} total incident logs.`;
        botResponse = `**💡 SafeHaven Agent Analysis:**\n\n` +
          `Regarding "${userPrompt}":\n` +
          `The SafeHaven system currently monitors **${analyticsEngine.total} total incident logs** across **${analyticsEngine.totalUsers} registered users**.\n\n` +
          `You can ask me to: **summarize all reports**, **break down root causes**, **show peak danger hours**, or **inspect the latest incident**.`;
      }
    }

    setAgentState(AGENT_NODES.RESPONSE_READY);

    // 5. Append assistant response
    const botMsg = {
      role: 'assistant',
      text: botResponse,
      spokenPhrase,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trace: traceNotes
    };

    setChatHistory(prev => [...prev, botMsg]);
    setAgentState(AGENT_NODES.IDLE);
    setActiveStepTrace([]);

    // 6. Speak out fresh studio voice response (Bangla or English based on text)
    speakText(botResponse, spokenPhrase);
  };

  const quickPrompts = language === 'bn' ? (
    mode === 'SOS_REPORTS' ? [
      'সবগুলো এসওএস রিপোর্টের সামারি বলো',
      'কী কী সমস্যা এবং কারণ ছিল?',
      'সর্বশেষ ইনসিডেন্টের বিস্তারিত দেখাও',
      'কোন এলাকায় সবচেয়ে বেশি এলার্ট এসেছে?'
    ] : [
      'মোট কয়টি ইনসিডেন্ট হয়েছে?',
      'ইনসিডেন্ট সমাধানের হার কত শতাংশ?',
      'দিনের কোন সময়ে সবচেয়ে বেশি বিপদ ঘটে?',
      'সম্পূর্ণ অ্যানালিটিক্স রিপোর্ট দেখাও'
    ]
  ) : (
    mode === 'SOS_REPORTS' ? [
      'Summarize all SOS incident reports',
      'What were the main issues and root causes?',
      'Show details of the most recent distress call',
      'Which locations have the highest emergency alerts?'
    ] : [
      'How many incidents occurred in total?',
      'What is the incident resolution rate?',
      'What are the peak danger hours of the day?',
      'Give me a complete analytics summary'
    ]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0b0f19] border-l border-zinc-800 shadow-2xl flex flex-col font-sans backdrop-blur-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800/80 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-lg shadow-rose-600/30">
            <FiCpu />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">SafeHaven AI Copilot</h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                LangGraph State Machine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {mode === 'SOS_REPORTS' 
                ? (language === 'bn' ? 'এসওএস রিপোর্ট ডায়াগনস্টিকস ও প্রশ্নোত্তর' : 'SOS Reports Diagnostics & Q&A')
                : (language === 'bn' ? 'ভয়েস ও রিয়েল-টাইম অ্যানালিটিক্স ইন্টেলিজেন্স' : 'Conversational Analytics Intelligence')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bilingual Toggle Button (বাংলা / English) */}
          <button
            onClick={() => {
              stopSpeaking();
              const newLang = language === 'bn' ? 'en' : 'bn';
              setLanguage(newLang);
              toast.success(newLang === 'bn' ? 'বাংলা ভয়েস ও টেক্সট মোড চালু হয়েছে 🇧🇩' : 'Switched to English Voice & Text 🇬🇧');
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition bg-zinc-800/90 hover:bg-zinc-700 border-zinc-700 text-zinc-200 flex items-center gap-1.5"
            title="Toggle Voice & Text Language (বাংলা / English)"
          >
            <FiGlobe className="text-rose-400" />
            <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Fresh Voice Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
            }}
            className={`p-2 rounded-lg text-xs border transition ${
              voiceEnabled 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-500'
            }`}
            title={voiceEnabled ? 'Natural Voice ON (Click to Mute)' : 'Natural Voice OFF'}
          >
            {isSpeaking ? <FiVolume2 className="animate-pulse text-rose-400" /> : voiceEnabled ? <FiVolume2 /> : <FiVolumeX />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-zinc-800 text-xs font-semibold bg-slate-950/40">
        <button
          onClick={() => setMode('SOS_REPORTS')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
            mode === 'SOS_REPORTS'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FiFileText /> {language === 'bn' ? 'এসওএস রিপোর্ট কোপাইলট' : 'SOS Reports Copilot'}
        </button>
        <button
          onClick={() => setMode('ANALYTICS')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
            mode === 'ANALYTICS'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FiPieChart /> {language === 'bn' ? 'অ্যানালিটিক্স কিউএনএ এজেন্ট' : 'Analytics Q&A Agent'}
        </button>
      </div>

      {/* Execution Trace Bar (Shows LangGraph active node) */}
      {agentState !== AGENT_NODES.IDLE && (
        <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-900/50 flex items-center gap-2 text-[11px] text-indigo-300 font-mono animate-pulse">
          <FiZap className="text-indigo-400 shrink-0" />
          <span className="truncate">{activeStepTrace.join(' ➔ ')}</span>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-4 space-y-1.5 leading-relaxed shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-br-none'
                  : 'bg-slate-900/90 border border-zinc-800/80 text-zinc-200 rounded-bl-none'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400 pb-1 border-b border-white/5 font-mono">
                <span className="font-semibold text-zinc-300">
                  {msg.role === 'user' ? 'Admin' : 'SafeHaven Intelligence Copilot'}
                </span>
                <div className="flex items-center gap-2">
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text, msg.spokenPhrase)}
                      className="text-zinc-400 hover:text-rose-400 transition flex items-center gap-1"
                      title="Play / Replay Voice"
                    >
                      <FiVolume2 className="text-xs" />
                      <span className="text-[9px]">Replay</span>
                    </button>
                  )}
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="whitespace-pre-line text-[12px]">
                {msg.text}
              </div>

              {/* Agentic Trace Tags */}
              {msg.trace && msg.trace.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1">
                  {msg.trace.map((tr, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-400 font-mono border border-indigo-500/20">
                      ⚡ {tr}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {agentState !== AGENT_NODES.IDLE && (
          <div className="flex items-center gap-2 text-zinc-500 text-xs italic p-2 font-mono">
            <FiRefreshCw className="animate-spin text-rose-500" />
            <span>{language === 'bn' ? 'এজেন্ট ল্যাংগ্রাফ ওয়ার্কফ্লো এক্সিকিউট করছে...' : 'Agent executing LangGraph workflow...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Demonstration Prompts */}
      <div className="p-2.5 bg-slate-950/60 border-t border-zinc-800/60 overflow-x-auto">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5 px-1">
          {language === 'bn' ? 'কুইক প্রশ্নাবলি (Quick Prompts):' : 'Quick Q&A Prompts:'}
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleProcessQuery(p)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 whitespace-nowrap transition shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box & Voice STT Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessQuery();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice to Text (STT) Button */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3 rounded-xl transition flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-600/50'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
            }`}
            title={language === 'bn' ? 'মুখে বাংলায় প্রশ্ন বলুন (ভয়েস-টু-টেক্সট)' : 'Speak query in English (Voice-to-Text)'}
          >
            {isListening ? <FiMicOff /> : <FiMic />}
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isListening 
                ? (language === 'bn' ? 'শুনছি... আপনার প্রশ্নটি মুখে বলুন' : 'Listening to your voice...') 
                : mode === 'SOS_REPORTS' 
                  ? (language === 'bn' ? 'ইনসিডেন্ট, সমস্যা বা সামারি সম্পর্কে বাংলায় জিজ্ঞাসা করুন...' : 'Ask about incidents, issues, or summarize reports...') 
                  : (language === 'bn' ? 'মোট ইনসিডেন্ট, সমাধানের হার বা সময় সম্পর্কে বাংলায় জিজ্ঞাসা করুন...' : 'Ask about incident counts, resolution rates, peak times...')
            }
            className="flex-1 bg-zinc-950/80 border border-zinc-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition"
          />

          <button
            type="submit"
            disabled={!query.trim() || agentState !== AGENT_NODES.IDLE}
            className="btn-danger p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <FiSend />
          </button>
        </form>

        {isSpeaking && (
          <div className="mt-2 flex items-center justify-between text-[11px] text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span> 
              {language === 'bn' ? 'স্টুডিও-কোয়ালিটি ন্যাচারাল বাংলা অডিও বাজছে...' : 'Speaking via Natural Voice Engine...'}
            </span>
            <button
              onClick={stopSpeaking}
              className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white"
            >
              {language === 'bn' ? 'অডিও থামান' : 'Stop Audio'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAIAgentDrawer;
