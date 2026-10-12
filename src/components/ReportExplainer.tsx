import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Info,
  RefreshCw,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { ReportExplanation } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

const SAMPLE_REPORTS = [
  {
    titleKey: 'sampleCbcTitle',
    defaultTitle: 'Complete Blood Count (CBC)',
    description: 'Hemoglobin, White Blood Cells, Platelets',
    text: `PATIENT DIAGNOSTIC LABORATORY REPORT (FICTIONAL SAMPLE)
Test Name: Complete Blood Count (CBC) with Differential
Collection: Morning | Fasting: Yes

Parameters:
• Hemoglobin (Hb): 11.2 g/dL (Reference Range: 12.0 - 15.5 g/dL)
• Total Leukocyte Count (WBC): 7,400 /uL (Reference Range: 4,500 - 11,000 /uL)
• Platelet Count: 210,000 /uL (Reference Range: 150,000 - 450,000 /uL)
• Packed Cell Volume (PCV / Hematocrit): 34.1 % (Reference Range: 36.0 - 46.0 %)
• Mean Corpuscular Volume (MCV): 78.5 fL (Reference Range: 80.0 - 96.0 fL)`,
  },
  {
    titleKey: 'sampleLipidTitle',
    defaultTitle: 'Lipid Profile',
    description: 'Cholesterol, Triglycerides, HDL, LDL',
    text: `BIOCHEMISTRY CLINICAL REPORT (FICTIONAL SAMPLE)
Test Name: Fasting Lipid Panel
Fasting Duration: 12 Hours

Parameters:
• Total Cholesterol: 215 mg/dL (Desirable: < 200 mg/dL)
• HDL Cholesterol ("Good"): 48 mg/dL (Protective: > 40 mg/dL in men, > 50 mg/dL in women)
• LDL Cholesterol ("Calculated"): 138 mg/dL (Optimal: < 100 mg/dL, Borderline: 100 - 159 mg/dL)
• Triglycerides: 145 mg/dL (Normal: < 150 mg/dL)
• VLDL Cholesterol: 29 mg/dL (Reference: < 30 mg/dL)`,
  },
  {
    titleKey: 'sampleThyroidTitle',
    defaultTitle: 'Thyroid Function (TSH)',
    description: 'Thyroid Stimulating Hormone & Free T4',
    text: `ENDOCRINOLOGY LABORATORY REPORT (FICTIONAL SAMPLE)
Test Name: Thyroid Evaluation

Parameters:
• TSH (Thyroid Stimulating Hormone): 5.42 uIU/mL (Reference Range: 0.45 - 4.50 uIU/mL)
• Free Thyroxine (FT4): 1.15 ng/dL (Reference Range: 0.82 - 1.77 ng/dL)
Method: Chemiluminescent Immunoassay (CLIA)`,
  },
];

export const ReportExplainer: React.FC = () => {
  const { t, currentLanguage, isRTL } = useLanguage();

  const [reportInput, setReportInput] = useState('');
  const [explanation, setExplanation] = useState<ReportExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyzeReport = async (textToUse?: string) => {
    const text = (textToUse !== undefined ? textToUse : reportInput).trim();
    if (!text) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/explain-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText: text,
          language: currentLanguage.name,
          languageCode: currentLanguage.code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze medical report text.');
      }

      const data: ReportExplanation = await response.json();
      setExplanation(data);
    } catch (err: any) {
      console.error('Report explainer error:', err);
      setErrorMessage(
        'Unable to explain the report at this moment. Please verify the text or try one of the demonstration samples below.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setReportInput(sampleText);
    handleAnalyzeReport(sampleText);
  };

  const handleReset = () => {
    setReportInput('');
    setExplanation(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.explainerTitle}
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {currentLanguage.nativeName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.explainerSubtitle}
          </p>
        </div>

        {explanation && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.btnClearReport}</span>
          </button>
        )}
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">{t.criticalSafetyBoxTitle}</span>
          <p className="leading-relaxed">
            {t.explainerSafetyNotice}
          </p>
        </div>
      </div>

      {/* Sample Quick Load Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          {t.explainerSamplesLabel}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_REPORTS.map((s, idx) => {
            const title =
              s.titleKey === 'sampleCbcTitle'
                ? t.sampleCbcTitle
                : s.titleKey === 'sampleLipidTitle'
                ? t.sampleLipidTitle
                : t.sampleThyroidTitle;

            return (
              <button
                key={idx}
                onClick={() => handleSelectSample(s.text)}
                className="text-left p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer shadow-xs space-y-1"
              >
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>{title}</span>
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          {t.explainerPasteLabel}
        </label>
        <textarea
          rows={6}
          value={reportInput}
          onChange={(e) => setReportInput(e.target.value)}
          placeholder={t.explainerPlaceholder}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-slate-400">
            Fictional sample data only. Do not share real personal medical records.
          </span>
          <button
            onClick={() => handleAnalyzeReport()}
            disabled={!reportInput.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>{t.explainingReport}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{t.btnExplainReport}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Explainer Results View */}
      {explanation && (
        <div className="bg-white rounded-3xl border-2 border-indigo-500 p-6 sm:p-8 shadow-xl space-y-7 animate-in fade-in duration-200">
          {/* Header Overview */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
              {explanation.reportType}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {explanation.reportType} — {currentLanguage.nativeName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {explanation.overview}
            </p>
          </div>

          {/* Preserved Parameters Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              {t.analyzedParametersTitle}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {explanation.parameters.map((param, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/60">
                    <div className="font-bold text-slate-900 text-sm sm:text-base">
                      {param.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-900 bg-indigo-100/70 px-2.5 py-1 rounded-lg">
                        {param.reportedValue}
                      </span>
                      {param.referenceRange && (
                        <span className="text-[11px] text-slate-500">
                          (Ref: {param.referenceRange})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">{t.whatItMeans}</strong> {param.plainLanguageMeaning}
                  </div>

                  <div className="text-slate-600 text-xs italic bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-700">{t.neutralObservation}</strong> {param.neutralObservation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Context Checklist */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t.missingContextTitle}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {t.missingContextDesc}
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-amber-950 text-xs">
              {explanation.missingContextFactors.map((fac, fIdx) => (
                <li key={fIdx}>{fac}</li>
              ))}
            </ul>
          </div>

          {/* Questions for Doctor */}
          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-xs sm:text-sm">
              <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{t.questionsForDoctorTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {explanation.questionsForDoctor.map((q, qIdx) => (
                <div key={qIdx} className="p-3 bg-white rounded-xl border border-teal-100 text-slate-800 font-medium">
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-2 text-[11px] text-slate-500 text-center">
            {explanation.disclaimer || t.explainerSafetyNotice}
          </div>
        </div>
      )}
    </div>
  );
};
