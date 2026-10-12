import React, { useState, useEffect } from 'react';
import { Globe, Check, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageWelcomeModalProps {
  forceOpen?: boolean;
  onCloseModal?: () => void;
}

export const LanguageWelcomeModal: React.FC<LanguageWelcomeModalProps> = ({
  forceOpen = false,
  onCloseModal,
}) => {
  const { currentLanguage, setLanguage, supportedLanguages, t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);

  useEffect(() => {
    // Check if user already acknowledged language on this browser
    const confirmed = localStorage.getItem('carebridge_first_visit_lang_confirmed');
    if (!confirmed || forceOpen) {
      setIsOpen(true);
    }

    // Detect browser language
    try {
      const browserLang = navigator.language?.slice(0, 2).toLowerCase();
      const match = supportedLanguages.find((l) => l.code === browserLang);
      if (match) {
        setDetectedCode(match.code);
      }
    } catch {
      // browser language detection unavailable
    }
  }, [forceOpen, supportedLanguages]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    try {
      localStorage.setItem('carebridge_first_visit_lang_confirmed', 'true');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setIsOpen(false);
    onCloseModal?.();
  };

  const detectedLanguage = supportedLanguages.find((l) => l.code === detectedCode);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-blue-900 text-white p-5 sm:p-6 relative">
          {localStorage.getItem('carebridge_first_visit_lang_confirmed') && (
            <button
              onClick={handleConfirm}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5 text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4 text-teal-300" />
            <span>Select Your Language • भाषा चुनें • اپنی زبان منتخب کریں</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome to CareBridge AI
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            Complete healthcare guidance, report explanations, emergency alerts, and doctor summaries in your preferred language.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Browser Detection Recommendation Banner */}
          {detectedLanguage && detectedLanguage.code !== currentLanguage.code && (
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Detected from your browser:{' '}
                  <strong>{detectedLanguage.nativeName} ({detectedLanguage.name})</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLanguage(detectedLanguage.code)}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Switch to {detectedLanguage.nativeName}
              </button>
            </div>
          )}

          {/* Languages Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Choose from 11 Indian &amp; Regional Languages</span>
              <span className="text-teal-700 font-semibold">{currentLanguage.nativeName} selected</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {supportedLanguages.map((lang) => {
                const isSelected = currentLanguage.code === lang.code;
                const isDetected = detectedCode === lang.code;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] relative ${
                      isSelected
                        ? 'bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50/80'
                    }`}
                    dir={lang.dir}
                  >
                    <div className="flex items-start justify-between gap-1 w-full">
                      <span className="font-extrabold text-slate-900 text-base">
                        {lang.nativeName}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {lang.flagLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                      <span>{lang.name}</span>
                      {isDetected && !isSelected && (
                        <span className="text-[9px] font-bold text-teal-700 bg-teal-100/60 px-1 rounded">
                          Detected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reassurance Note */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              You can switch your language at any time using the selector in the top bar. All health guidance, safety checks, lab explanations, and doctor summaries will immediately update.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Active: <strong className="text-slate-800">{currentLanguage.nativeName} ({currentLanguage.name})</strong>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue in {currentLanguage.nativeName}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
