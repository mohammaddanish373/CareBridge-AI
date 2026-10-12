import React from 'react';
import {
  Compass,
  Building2,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ExternalLink,
  HeartHandshake,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HomeHeroProps {
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onNavigate,
  onOpenEmergency,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>{t.hackathonBadge}</span>
            <span className="text-teal-400">/</span>
            <span className="text-slate-600">{t.trackBadge}</span>
          </div>

          {/* Headline & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {t.heroHeading1}{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent">
                {t.heroHeadingGradient}
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {t.heroSubheading}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onNavigate('guidance')}
              className="w-full sm:w-auto px-7 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Compass className="w-5 h-5 text-teal-100 group-hover:rotate-45 transition-transform shrink-0" />
              <span>{t.btnStartGuidance}</span>
              <ArrowRight className={`w-4 h-4 text-teal-200 ${isRTL ? 'rotate-180 mr-0.5' : 'ml-0.5'}`} />
            </button>

            <button
              onClick={() => onNavigate('facilities')}
              className="w-full sm:w-auto px-7 py-4 bg-blue-900 hover:bg-blue-950 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-blue-200 shrink-0" />
              <span>{t.btnFindFacilities}</span>
            </button>
          </div>

          {/* Social Barrier Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
              <Coins className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {t.barrierSubsidized}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {t.barrierInsurance}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
              <ShieldAlert className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {t.barrierEmergency}
            </span>
          </div>
        </div>
      </section>

      {/* Visible Safety Limitation Notice Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1.5">
              <h2 className="text-sm sm:text-base font-bold text-amber-950">
                {t.criticalSafetyBoxTitle}
              </h2>
              <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                {t.criticalSafetyBoxDesc}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-amber-800 font-semibold">
                  {t.emergencySafetyChecklistTitle}
                </span>
                <button
                  onClick={onOpenEmergency}
                  className="font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
                >
                  {t.emergencyDialText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Main Impact Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.featuresTitle}
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Health Guidance Chat */}
          <div
            onClick={() => onNavigate('guidance')}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors">
                  {t.cardGuidanceTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.cardGuidanceDesc}
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>{t.cardGuidanceAction}</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 2: Facility Finder */}
          <div
            onClick={() => onNavigate('facilities')}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-800 transition-colors">
                  {t.cardFacilitiesTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.cardFacilitiesDesc}
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-800">
              <span>{t.cardFacilitiesAction}</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 3: Report Explainer */}
          <div
            onClick={() => onNavigate('explainer')}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {t.cardExplainerTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.cardExplainerDesc}
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700">
              <span>{t.cardExplainerAction}</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 4: Reminders */}
          <div
            onClick={() => onNavigate('reminders')}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.cardRemindersTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.cardRemindersDesc}
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>{t.cardRemindersAction}</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Flow Diagram */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              End-to-End User Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.journeyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.journeySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center text-sm border border-teal-500/40">
                1
              </div>
              <h4 className="font-bold text-sm text-white">{t.step1Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step1Desc}</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center text-sm border border-teal-500/40">
                2
              </div>
              <h4 className="font-bold text-sm text-white">{t.step2Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step2Desc}</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center text-sm border border-teal-500/40">
                3
              </div>
              <h4 className="font-bold text-sm text-white">{t.step3Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step3Desc}</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center text-sm border border-teal-500/40">
                4
              </div>
              <h4 className="font-bold text-sm text-white">{t.step4Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prototype Status & Social Impact Commitment */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-lg">
                Prototype Transparency &amp; Hackathon Audit
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              CareBridge AI supports 11 Indian &amp; regional languages with real-time translation and bilingual doctor summaries. All Gemini model calls execute server-side with strict medical non-diagnostic guardrails.
            </p>
          </div>

          <button
            onClick={() => onNavigate('about')}
            className="shrink-0 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>View Architecture &amp; Roadmap</span>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </section>
    </div>
  );
};
