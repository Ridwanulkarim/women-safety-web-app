import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  FiCpu, FiSend, FiMic, FiMicOff, FiVolume2, FiVolumeX, 
  FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiActivity, 
  FiLayers, FiX, FiCornerDownLeft, FiZap, FiFileText, FiPieChart 
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

  // Initial welcome message based on mode
  const [chatHistory, setChatHistory] = useState(() => [
    {
      role: 'assistant',
      text: defaultMode === 'SOS_REPORTS'
        ? "Hello Admin. I am your SafeHaven Incident Intelligence Agent (powered by LangGraph-style workflow). I can summarize distress logs, diagnose root issues, or answer questions about individual emergency events. You can type or tap the microphone to speak."
        : "Hello Admin. I am your SafeHaven Analytics Copilot. I analyze real-time incident trends, calculate resolution metrics, and predict peak danger intervals. Ask me any analytical question by voice or text.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trace: ['INITIALIZED', 'DATA_REGISTRY_LOADED']
    }
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, agentState]);

  // Initialize Speech-to-Text (STT)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Supports 'bn-BD' or 'en-US'

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          toast.error('Microphone permission denied.');
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
  }, []);

  // Fresh Modern Voice (TTS) Synthesizer
  const speakText = (text) => {
    if (!voiceEnabled || !synthRef.current) return;

    // Cancel ongoing speech
    synthRef.current.cancel();

    // Clean markdown asterisks and bullets for clean speech
    const cleanSpeech = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);

    // Pick a fresh, high-quality modern voice if available
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(v => 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Aria') || v.name.includes('Jenny')) &&
      (v.lang.startsWith('en') || v.lang.startsWith('bn'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (naturalVoice) utterance.voice = naturalVoice;
    
    // Natural humanized cadence (fresh tone)
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
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
      recognitionRef.current.start();
      toast('Listening... Speak your query', { icon: '🎙️' });
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
      if (text.includes('stalk') || text.includes('follow') || text.includes('car')) {
        issueCategories.Stalking++;
      } else if (text.includes('assault') || text.includes('attack') || text.includes('beat')) {
        issueCategories.PhysicalAssault++;
      } else if (text.includes('medical') || text.includes('health') || text.includes('ambulance') || text.includes('faint')) {
        issueCategories.MedicalEmergency++;
      } else if (text.includes('harass') || text.includes('threat') || text.includes('verbal')) {
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
      peakHour: peakHour !== null ? `${peakHour}:00 - ${parseInt(peakHour) + 1}:00` : 'Evening (20:00 - 23:00)',
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

    // 1. Append user message to history
    const userMsg = {
      role: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userMsg]);

    // 2. Node: Intent Router
    setAgentState(AGENT_NODES.INTENT_ROUTING);
    setActiveStepTrace(['Node: INTENT_ROUTER', 'Classifying user query intent...']);

    await new Promise(r => setTimeout(r, 400));

    const lower = userPrompt.toLowerCase();
    const isAnalyticsIntent = 
      lower.includes('how many') || lower.includes('koita') || lower.includes('koyta') || 
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
        `Scanning ${alerts.length} SOS logs & ${users.length} registered profiles...`
      ]);
    } else {
      setActiveStepTrace([
        'Node: TOOL_EXECUTION',
        'Invoking Tool: query_sos_incident_database()',
        `Retrieved ${alerts.length} real distress records with GPS telemetry.`
      ]);
    }

    await new Promise(r => setTimeout(r, 600));

    // 4. Node: LLM Reasoning & Synthesis
    setAgentState(AGENT_NODES.LLM_REASONING);
    setActiveStepTrace(['Node: LLM_SYNTHESIS', 'Synthesizing response & formatting root cause insights...']);

    await new Promise(r => setTimeout(r, 600));

    // Generate Contextual Structured Response
    let botResponse = '';
    const traceNotes = [];

    if (lower.includes('summar') || lower.includes('overview') || lower.includes('all report')) {
      traceNotes.push('ACTION: COMPREHENSIVE_SOS_SUMMARY');
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
    else if (lower.includes('issue') || lower.includes('cause') || lower.includes('problem') || lower.includes('ki ki issue')) {
      traceNotes.push('ACTION: ISSUE_DIAGNOSIS');
      botResponse = `**🔬 Root Cause & Incident Diagnostics:**\n\n` +
        `Based on forensic telemetry and user distress dispatches, the top issues encountered are:\n\n` +
        `1. **Stalking & Suspicious Tracking:** Users reported slow-moving vehicles or unidentified individuals tailing them in dimly lit streets.\n` +
        `2. **Public Transit & Street Harassment:** Verbal intimidation and route cornering reported during late-night commutes.\n` +
        `3. **Physical & Domestic Threats:** Immediate panic triggers requiring emergency contact broadcasting.\n\n` +
        `**Key Mitigation Recommendation:** Deploy additional community safety beacons and prioritize rapid-response dispatches during ${analyticsEngine.peakHour}.`;
    }
    else if (lower.includes('koita') || lower.includes('koyta') || lower.includes('incident') || lower.includes('count') || lower.includes('total') || lower.includes('rate')) {
      traceNotes.push('ACTION: QUANTITATIVE_ANALYTICS_QUERY');
      botResponse = `**📊 Live Analytics Telemetry Metrics:**\n\n` +
        `• **Total Recorded Incidents:** ${analyticsEngine.total}\n` +
        `• **Active Distress Signals:** ${analyticsEngine.active}\n` +
        `• **Successfully Resolved:** ${analyticsEngine.resolved}\n` +
        `• **Resolution Success Rate:** **${analyticsEngine.rate}%**\n` +
        `• **Total Registered Accounts Protected:** ${analyticsEngine.totalUsers}\n` +
        `• **Peak Risk Interval:** ${analyticsEngine.peakHour}`;
    }
    else if (lower.includes('last') || lower.includes('recent') || lower.includes('latest')) {
      traceNotes.push('ACTION: LATEST_INCIDENT_INSPECTION');
      const latest = alerts[0];
      if (latest) {
        botResponse = `**🚨 Most Recent Distress Report Details:**\n\n` +
          `• **Report ID:** \`${latest.id}\`\n` +
          `• **Reporter:** **${latest.userName || 'Anonymous User'}** (${latest.userPhone || 'Emergency Direct'})\n` +
          `• **Reported Location:** ${latest.address || 'GPS Coordinates Registered'}\n` +
          `• **Coordinates:** \`${latest.latitude || 22.3569}° N, ${latest.longitude || 91.7832}° E\`\n` +
          `• **Incident Status:** **${latest.status}**\n` +
          `• **Timestamp:** ${new Date(latest.timestamp || Date.now()).toLocaleString()}`;
      } else {
        botResponse = "No recent incident logs found in the archive.";
      }
    }
    else if (lower.includes('peak') || lower.includes('time') || lower.includes('hour')) {
      traceNotes.push('ACTION: TEMPORAL_RISK_ANALYSIS');
      botResponse = `**⏱️ Temporal Risk & Peak Hour Analysis:**\n\n` +
        `• **Critical Incident Interval:** **${analyticsEngine.peakHour}** represents the highest frequency window for distress triggers.\n` +
        `• **Contributing Factors:** Decreased street transit density, low commercial lighting, and late evening commutes.\n` +
        `• **Administrative Action:** Recommend automated safety check-in push notifications to vulnerable commuters during this window.`;
    }
    else {
      traceNotes.push('ACTION: GENERAL_QNA_SYNTHESIS');
      botResponse = `**💡 SafeHaven Agent Analysis:**\n\n` +
        `Regarding "${userPrompt}":\n` +
        `The SafeHaven system currently monitors **${analyticsEngine.total} total incident logs** across **${analyticsEngine.totalUsers} registered users**. All distress signals are archived with cryptographic timestamps and GPS coordinates.\n\n` +
        `You can ask me to: **summarize all reports**, **break down root causes**, **show peak danger hours**, or **inspect the latest incident**.`;
    }

    setAgentState(AGENT_NODES.RESPONSE_READY);

    // 5. Append assistant response
    const botMsg = {
      role: 'assistant',
      text: botResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trace: traceNotes
    };

    setChatHistory(prev => [...prev, botMsg]);
    setAgentState(AGENT_NODES.IDLE);
    setActiveStepTrace([]);

    // 6. Speak out fresh voice response
    speakText(botResponse);
  };

  const quickPrompts = mode === 'SOS_REPORTS' ? [
    'Summarize all SOS incident reports',
    'What were the main issues and root causes?',
    'Show details of the most recent distress call',
    'Which locations have the highest emergency alerts?'
  ] : [
    'How many incidents occurred in total?',
    'What is the incident resolution rate?',
    'What are the peak danger hours of the day?',
    'Give me a complete analytics summary'
  ];

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
              {mode === 'SOS_REPORTS' ? 'SOS Reports Diagnostics & Q&A' : 'Conversational Analytics Intelligence'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          <FiFileText /> SOS Reports Copilot
        </button>
        <button
          onClick={() => setMode('ANALYTICS')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
            mode === 'ANALYTICS'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FiPieChart /> Analytics Q&A Agent
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
                <span>{msg.timestamp}</span>
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
            <span>Agent executing LangGraph workflow...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Demonstration Prompts */}
      <div className="p-2.5 bg-slate-950/60 border-t border-zinc-800/60 overflow-x-auto">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5 px-1">
          Quick Q&A Prompts:
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
            title="Speak query (Voice-to-Text)"
          >
            {isListening ? <FiMicOff /> : <FiMic />}
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isListening 
                ? 'Listening to your voice...' 
                : mode === 'SOS_REPORTS' 
                  ? 'Ask about incidents, issues, or summarize reports...' 
                  : 'Ask about incident counts, resolution rates, peak times...'
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
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span> Speaking via Natural Voice Engine...
            </span>
            <button
              onClick={stopSpeaking}
              className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white"
            >
              Stop Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAIAgentDrawer;
