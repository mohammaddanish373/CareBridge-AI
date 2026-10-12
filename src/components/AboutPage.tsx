import React from 'react';
import {
  HeartPulse,
  Target,
  ShieldCheck,
  Cpu,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Workflow,
  ArrowRight,
  GitBranch,
  Eye,
  Lock,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t, currentLanguage, isRTL } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
          <span>{t.hackathonBadge}</span>
          <span>•</span>
          <span>{t.trackBadge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.navAbout} • CareBridge AI
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
          {t.heroSubheading}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>Active Language: {currentLanguage.nativeName} ({currentLanguage.name})</span>
        </div>
      </div>

      {/* 1. The Social Problem */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Target className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold">1. The Social Challenge We Are Solving</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="font-bold text-slate-900">Healthcare Navigation Deserts</h4>
            <p className="text-slate-600 leading-relaxed">
              When symptoms arise, patients often lack basic guidance on whether their issue requires immediate emergency care, a general physician consultation, or a diagnostic test, leading to either dangerous delays or overcrowded emergency departments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="font-bold text-slate-900">Uncertain Costs &amp; Insurance Shocks</h4>
            <p className="text-slate-600 leading-relaxed">
              In countries like India, out-of-pocket medical expenditure accounts for over 45% of healthcare spending. Patients rarely know whether a clinic accepts their Ayushman Bharat PM-JAY card or private insurance until they arrive at the billing counter.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="font-bold text-slate-900">Medical Jargon &amp; Intimidation</h4>
            <p className="text-slate-600 leading-relaxed">
              Laboratory reports with acronyms like TSH, MCV, or WBC create severe panic. Patients often search the open web, encountering catastrophic worst-case search results instead of plain-language context.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="font-bold text-slate-900">Rushed 3-Minute Consultations</h4>
            <p className="text-slate-600 leading-relaxed">
              Primary care doctors are overwhelmed, often spending under 3 minutes per patient. Patients forget key symptoms and timeline details, missing crucial opportunities to ask actionable questions.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-4 shadow-lg">
        <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
          Our Mission &amp; Guiding Principle
        </div>
        <h3 className="text-xl sm:text-2xl font-black">
          "Understand Your Next Step. Find the Right Care."
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          CareBridge AI is designed not to play doctor, but to act as a supportive, safety-first navigator. By organizing patient thoughts, performing dual-layer emergency checks, explaining lab terms, and uncovering real costs, we restore clarity, agency, and dignity to the patient journey.
        </p>
      </section>

      {/* 3. How AI is Used Safely */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Cpu className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold">2. How AI Is Safely Engineered (Gemini 3.8 Flash)</h2>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 text-xs sm:text-sm shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900">1. Server-Side Execution</span>
              <p className="text-slate-600 text-xs">
                All Gemini API calls execute strictly on the server backend (`server.ts`). Secret API keys are never bundled into client-side code.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900">2. Hardened System Instructions</span>
              <p className="text-slate-600 text-xs">
                The model is explicitly forbidden from diagnosing, recommending prescription dosages, ruling out illnesses, or fabricating clinical history.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900">3. Deterministic Safety Triage</span>
              <p className="text-slate-600 text-xs">
                We do not rely solely on the LLM to identify emergencies. Independent regex-based red-flag filters intercept chest pain and stroke signs immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Transparency Audit: What Works vs Sample Data */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Eye className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold">3. Transparency Audit: Implemented vs Demonstration Mode</h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm bg-white">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Component</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Technology &amp; Implementation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Health Guidance Chat</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Fully Functional
                  </span>
                </td>
                <td className="p-3.5 text-xs">
                  Server-side Gemini 3.8 Flash model with safety guardrails asking one question at a time.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Safety Red-Flag Interception</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Fully Functional
                  </span>
                </td>
                <td className="p-3.5 text-xs">
                  Deterministic regex engine evaluating acute cardiac, stroke, and respiratory warning signs.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Clinician-Ready Summary</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Fully Functional
                  </span>
                </td>
                <td className="p-3.5 text-xs">
                  Structured JSON extraction with timeline, missing context, and 1-click clipboard copy.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Facility &amp; Fee Finder</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Dual Mode
                  </span>
                </td>
                <td className="p-3.5 text-xs">
                  Google Places API (New) enabled when API key is provided; verified benchmark directory with public tariffs (AIIMS, KEM, Apollo) when offline.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Medical Report Explainer</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Fully Functional
                  </span>
                </td>
                <td className="p-3.5 text-xs">
                  Educational plain-language translation preserving exact values &amp; units with doctor questions.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Prescription Reminders</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    Prototype Storage
                  </span>
                </td>
                <td className="p-3.5 text-xs">
                  Session memory persistence with Make (Integromat) webhook schema integration test.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Future Roadmap (7-Point Plan) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <GitBranch className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold">4. Seven-Point Future Development Roadmap</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              num: 1,
              title: 'Verified Live Healthcare Facility & Real-Time Availability',
              desc: 'Direct integration with municipal health dashboards for real-time OPD token wait times and emergency bed counts.',
            },
            {
              num: 2,
              title: 'Rigorous Verification of Facility Fees & Insurance Networks',
              desc: 'Live TPA network API queries ensuring cashless approvals are confirmed prior to patient arrival.',
            },
            {
              num: 3,
              title: 'Multilingual and Voice-First Accessibility',
              desc: 'Speech-to-speech interaction in 12+ regional Indian and global languages for non-literate community members.',
            },
            {
              num: 4,
              title: 'Secure, Encrypted Appointment & Medication Reminders',
              desc: 'DISHA / HIPAA compliant end-to-end encrypted push notifications with calendar integration.',
            },
            {
              num: 5,
              title: 'Handoff to Verified Non-Profit Telehealth Networks',
              desc: 'One-click direct sharing of the clinician summary to certified primary health centres and charitable teleconsultations.',
            },
            {
              num: 6,
              title: 'Clinically Evaluated Multimodal Report Explanations',
              desc: 'Pathologist-validated vision models to parse photo uploads of printed physical laboratory slips.',
            },
            {
              num: 7,
              title: 'Formal Clinical Review, Usability Testing & Bias Audits',
              desc: 'Academic partnership and institutional IRB approval to rigorously evaluate patient outcomes and safety.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-xs"
            >
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0 text-xs border border-teal-200">
                {item.num}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
