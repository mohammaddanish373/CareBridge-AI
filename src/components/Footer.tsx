import React from 'react';
import { HeartPulse, ShieldAlert, Phone, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenLanguageModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenEmergency,
  onOpenLanguageModal,
}) => {
  const { t, currentLanguage, isRTL } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-auto">
      {/* Disclaimer Banner in Footer */}
      <div className="bg-slate-950/80 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white text-xs">
                {t.criticalSafetyBoxTitle}:
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-3xl">
                {t.criticalSafetyBoxDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEmergency}
            className="shrink-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.emergencyDialText}</span>
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Language Switcher */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                CareBridge <span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t.tagline}
            </p>
            <div className="text-[11px] text-teal-400 font-semibold">
              {t.hackathonBadge}
            </div>

            {onOpenLanguageModal && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenLanguageModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
                  <span>{currentLanguage.nativeName} ({currentLanguage.name}) • {t.changeLanguage}</span>
                </button>
              </div>
            )}
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              {t.navHome}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guidance')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navGuidance}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navFacilities}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explainer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navExplainer}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reminders')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navReminders}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Safety Guardrails */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              {t.safetyNotice}
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>• {t.criticalSafetyBoxTitle}</li>
              <li>• {t.emergencySafetyChecklistTitle}</li>
              <li>• {t.barrierSubsidized}</li>
              <li>• {t.barrierInsurance}</li>
              <li>• {t.barrierEmergency}</li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              {t.emergencyNotice}
            </h4>
            <div className="space-y-1.5 text-slate-400 text-xs">
              <div>India: <strong className="text-white ltr-preserve">112</strong> ({t.emergencyNotice})</div>
              <div>US &amp; Canada: <strong className="text-white ltr-preserve">911</strong></div>
              <div>United Kingdom: <strong className="text-white ltr-preserve">999</strong></div>
              <div>European Union: <strong className="text-white ltr-preserve">112</strong></div>
              <button
                onClick={onOpenEmergency}
                className="text-teal-400 hover:underline pt-1 text-[11px] cursor-pointer"
              >
                {t.emergencyChange} &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; 2026 CareBridge AI. {t.hackathonBadge}.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {t.navAbout}
            </button>
            <span>•</span>
            <span>Privacy-Preserving Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

