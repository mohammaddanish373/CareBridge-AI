import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Compass,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  Copy,
  Check,
  Printer,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Phone,
  Building2,
  Stethoscope,
  Globe,
  Columns,
} from 'lucide-react';
import { ChatMessage, ClinicianSummary } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HealthGuidanceProps {
  onNavigateToFacilities: () => void;
  onTriggerEmergency: (reason: string, action?: string) => void;
}

export const HealthGuidance: React.FC<HealthGuidanceProps> = ({
  onNavigateToFacilities,
  onTriggerEmergency,
}) => {
  const { t, currentLanguage, isRTL } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'model',
      text: t.guidanceInitialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clinician Summary State
  const [summary, setSummary] = useState<ClinicianSummary | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [bilingualMode, setBilingualMode] = useState<'patient' | 'english' | 'bilingual'>('patient');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // When language changes and only welcome message exists, update greeting to match
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([
        {
          id: 'welcome-1',
          role: 'model',
          text: t.guidanceInitialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [t.guidanceInitialGreeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputText('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/health-guidance/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, text: m.text })),
          language: currentLanguage.name,
          languageCode: currentLanguage.code,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Unable to connect to guidance service.');
      }

      const data = await response.json();

      // If emergency red-flag triggered
      if (data.isEmergency) {
        onTriggerEmergency(
          data.emergencyReason || t.emergencyInterruptionTitle,
          data.emergencyAction
        );

        const alertMessage: ChatMessage = {
          id: `alert-${Date.now()}`,
          role: 'system',
          text: `🚨 ${t.emergencyInterruptionBadge}: ${data.emergencyReason || t.emergencyInterruptionTitle}\n\n${
            data.emergencyAction || t.emergencyProtocol1
          }\n\n${t.emergencyDialText}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergencyAlert: true,
          emergencyDetails: {
            reason: data.emergencyReason,
            action: data.emergencyAction,
          },
        };
        setMessages([...updatedMessages, alertMessage]);
        setIsLoading(false);
        return;
      }

      // Normal safe follow-up question
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedMessages, aiReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        'The guidance service could not process your request at this moment. If your symptoms are distressing, please seek qualified medical assistance.'
      );
      // Safe fallback response in chat
      const fallbackReply: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'model',
        text: 'Could you tell me more about when this symptom started and whether it is getting better, worse, or staying the same?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedMessages, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (messages.filter((m) => m.role === 'user').length === 0) {
      setErrorMessage('Please describe your health concern first before generating a summary.');
      return;
    }

    setIsGeneratingSummary(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/health-guidance/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, text: m.text })),
          language: currentLanguage.name,
          languageCode: currentLanguage.code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary.');
      }

      const data: ClinicianSummary = await response.json();
      setSummary(data);
    } catch (err: any) {
      console.error('Summary error:', err);
      setErrorMessage('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const activeSummaryView = (): ClinicianSummary | null => {
    if (!summary) return null;
    if (bilingualMode === 'english' && summary.englishVersion) {
      return summary.englishVersion;
    }
    return summary;
  };

  const handleCopySummary = () => {
    const s = activeSummaryView();
    if (!s) return;

    let formatted = `CAREBRIDGE AI - CLINICIAN-READY HEALTH SUMMARY
Language: ${bilingualMode === 'english' ? 'English (Clinician Brief)' : currentLanguage.name}

1. MAIN CONCERN:
${s.mainConcern}

2. REPORTED DURATION & PROGRESSION:
${s.reportedDurationAndChanges}

3. REPORTED SYMPTOMS:
${s.reportedSymptoms.map((sym) => `• ${sym}`).join('\n')}

4. UNANSWERED CLINICAL QUESTIONS:
${s.unansweredQuestions?.map((q) => `• ${q}`).join('\n') || 'None'}

5. SUGGESTED QUESTIONS FOR THE CLINICIAN:
${s.questionsToAskClinician?.map((q) => `• ${q}`).join('\n') || 'None'}

6. CAUTIOUS NEXT STEP:
${s.cautiousNextStep}

DISCLAIMER:
${s.safetyNotice || t.summaryDisclaimer}`;

    if (bilingualMode === 'bilingual' && summary?.englishVersion) {
      const eng = summary.englishVersion;
      formatted += `\n\n========================================
ENGLISH TRANSLATION FOR HEALTHCARE PROFESSIONAL:
========================================

1. MAIN CONCERN:
${eng.mainConcern}

2. REPORTED DURATION & PROGRESSION:
${eng.reportedDurationAndChanges}

3. REPORTED SYMPTOMS:
${eng.reportedSymptoms.map((sym) => `• ${sym}`).join('\n')}

4. SUGGESTED QUESTIONS FOR CLINICIAN:
${eng.questionsToAskClinician?.map((q) => `• ${q}`).join('\n') || 'None'}

5. CAUTIOUS NEXT STEP:
${eng.cautiousNextStep}`;
    }

    navigator.clipboard.writeText(formatted);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleResetSession = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: t.guidanceInitialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setSummary(null);
    setErrorMessage(null);
    setInputText('');
  };

  const userTurnsCount = messages.filter((m) => m.role === 'user').length;

  const samplePrompts = [
    { label: t.sampleHeadacheLabel, text: t.sampleHeadacheText },
    { label: t.sampleBackpainLabel, text: t.sampleBackpainText },
    { label: t.sampleFeverLabel, text: t.sampleFeverText },
    { label: t.sampleEmergencyLabel, text: t.sampleEmergencyText, isEmergency: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Title & Scope Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.guidanceTitle}
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {currentLanguage.nativeName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.guidanceSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userTurnsCount >= 1 && (
            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary || isLoading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>{isGeneratingSummary ? t.btnSynthesizing : t.btnGenerateSummary}</span>
            </button>
          )}

          <button
            onClick={handleResetSession}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title={t.btnResetSession}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Notice Warning Box */}
      <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-900">{t.safetyNotice}</span>
          <p>
            {t.safetyBannerText}
          </p>
        </div>
      </div>

      {/* Sample Scenario Preset Buttons */}
      {userTurnsCount === 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {t.quickExamplesLabel}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                className={`text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                  p.isEmergency
                    ? 'border-rose-300 bg-rose-50/70 hover:bg-rose-100 text-rose-950 font-medium'
                    : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/40 text-slate-800'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>{p.label}</span>
                  {p.isEmergency && (
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-black">
                      RED-FLAG TEST
                    </span>
                  )}
                </div>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{p.text}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Conversation Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Chat History Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isAlert = msg.isEmergencyAlert;

            if (isAlert) {
              return (
                <div
                  key={msg.id}
                  className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 text-rose-950 space-y-2 animate-in fade-in zoom-in-95"
                >
                  <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm sm:text-base">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{t.emergencyInterruptionBadge}</span>
                  </div>
                  <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-medium">
                    {msg.text}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href="tel:112"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t.emergencyCallNow} (112)</span>
                    </a>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold select-none ${
                    isUser
                      ? 'bg-blue-900 text-white'
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  {isUser ? 'You' : 'CB'}
                </div>

                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-900 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div
                    className={`mt-1.5 text-[10px] text-right ${
                      isUser ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[75%] items-center">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                CB
              </div>
              <div className="bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200 flex items-center gap-2 text-slate-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">
                  {currentLanguage.name} ({currentLanguage.nativeName})...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 font-bold hover:underline cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.guidancePlaceholder}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t.btnSend}</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>{t.noPrivateDataNotice}</span>
            {userTurnsCount >= 2 && !summary && (
              <button
                onClick={handleGenerateSummary}
                className="text-teal-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                {t.readyForSummaryPrompt}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Clinician Summary Modal or Card */}
      {summary && (
        <div className="bg-white rounded-3xl border-2 border-teal-500 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {t.summaryBadge}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.summaryTitle}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-teal-600" />
                    <span>{t.btnCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t.btnCopySummary}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{t.btnPrint}</span>
              </button>
            </div>
          </div>

          {/* Bilingual Language Switcher Toggle for Doctor Consultation */}
          {summary.englishVersion && currentLanguage.code !== 'en' && (
            <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-teal-950 font-bold">
                <Globe className="w-4 h-4 text-teal-600" />
                <span>{t.bilingualToggleLabel}</span>
              </div>

              <div className="inline-flex rounded-xl bg-white p-1 border border-teal-200 shadow-2xs">
                <button
                  onClick={() => setBilingualMode('patient')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    bilingualMode === 'patient'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {currentLanguage.nativeName} ({t.viewInSelectedLang})
                </button>
                <button
                  onClick={() => setBilingualMode('english')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    bilingualMode === 'english'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  English ({t.viewInEnglish})
                </button>
                <button
                  onClick={() => setBilingualMode('bilingual')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    bilingualMode === 'bilingual'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Columns className="w-3.5 h-3.5" />
                    <span>{t.viewBilingualSideBySide}</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Single or Side-by-Side View */}
          {bilingualMode === 'bilingual' && summary.englishVersion ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Patient's Native Language */}
              <div className="space-y-5 p-5 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-extrabold text-sm text-teal-800">
                    {currentLanguage.nativeName} ({currentLanguage.name})
                  </span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                    Patient View
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] block">
                      {t.summaryMainConcern}
                    </span>
                    <p className="font-semibold text-slate-900 mt-1">{summary.mainConcern}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] block">
                      {t.summaryDurationProgression}
                    </span>
                    <p className="text-slate-800 mt-1">{summary.reportedDurationAndChanges}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] block">
                      {t.summaryReportedSymptoms}
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-800 mt-1">
                      {summary.reportedSymptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-teal-800 uppercase tracking-wide text-[11px] block">
                      {t.summaryDoctorQuestions}
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-800 mt-1">
                      {summary.questionsToAskClinician?.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-blue-900 uppercase tracking-wide text-[11px] block">
                      {t.summaryCautiousNextStep}
                    </span>
                    <p className="text-slate-900 font-medium mt-1">{summary.cautiousNextStep}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: English Clinician Brief */}
              <div className="space-y-5 p-5 bg-blue-50/50 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="font-extrabold text-sm text-blue-900">
                    English (Clinician Brief)
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                    Doctor View
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] block">
                      Main Concern
                    </span>
                    <p className="font-semibold text-slate-900 mt-1">{summary.englishVersion.mainConcern}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] block">
                      Duration &amp; Progression
                    </span>
                    <p className="text-slate-800 mt-1">{summary.englishVersion.reportedDurationAndChanges}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] block">
                      Symptoms Reported
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-800 mt-1">
                      {summary.englishVersion.reportedSymptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-teal-800 uppercase tracking-wide text-[11px] block">
                      Questions for Clinician
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-800 mt-1">
                      {summary.englishVersion.questionsToAskClinician?.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-blue-900 uppercase tracking-wide text-[11px] block">
                      Next Step Recommendation
                    </span>
                    <p className="text-slate-900 font-medium mt-1">{summary.englishVersion.cautiousNextStep}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Grid View */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                {/* Box 1: Main Concern */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {t.summaryMainConcern}
                  </span>
                  <p className="font-semibold text-slate-900 leading-relaxed">
                    {activeSummaryView()?.mainConcern}
                  </p>
                </div>

                {/* Box 2: Timeline & Changes */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {t.summaryDurationProgression}
                  </span>
                  <p className="text-slate-800 leading-relaxed">
                    {activeSummaryView()?.reportedDurationAndChanges}
                  </p>
                </div>

                {/* Box 3: Reported Symptoms */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {t.summaryReportedSymptoms}
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-slate-800">
                    {activeSummaryView()?.reportedSymptoms.map((sym, i) => (
                      <li key={i}>{sym}</li>
                    ))}
                  </ul>
                </div>

                {/* Box 4: Missing Questions */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    {t.summaryUnansweredQuestions}
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-amber-950">
                    {activeSummaryView()?.unansweredQuestions?.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Questions to Ask Doctor */}
              <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-3">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-600 shrink-0" />
                  {t.summaryDoctorQuestions}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  {activeSummaryView()?.questionsToAskClinician?.map((q, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-teal-100 text-slate-800 font-medium">
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cautious Next Step */}
              <div className="p-5 rounded-2xl bg-blue-900 text-white space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  {t.summaryCautiousNextStep}
                </span>
                <p className="text-sm font-medium leading-relaxed">
                  {activeSummaryView()?.cautiousNextStep}
                </p>
              </div>
            </div>
          )}

          {/* Action to Find Care */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 max-w-lg">
              {summary.safetyNotice || t.summaryDisclaimer}
            </p>

            <button
              onClick={onNavigateToFacilities}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>{t.btnFindFacilitiesForConcern}</span>
              <ArrowRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
