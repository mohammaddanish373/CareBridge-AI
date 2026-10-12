import React, { useState } from 'react';
import { AlertTriangle, Phone, X, ShieldAlert, HeartPulse, CheckCircle2 } from 'lucide-react';
import { EmergencyContact } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const EMERGENCY_NUMBERS: EmergencyContact[] = [
  { country: 'India', code: 'IN', number: '112', description: 'National All-in-One Emergency Helpline (Police, Ambulance, Fire)' },
  { country: 'United States & Canada', code: 'US', number: '911', description: 'Emergency Medical Services' },
  { country: 'United Kingdom', code: 'UK', number: '999', description: 'Emergency Medical Dispatch' },
  { country: 'European Union', code: 'EU', number: '112', description: 'European Emergency Number' },
  { country: 'Australia', code: 'AU', number: '000', description: 'Triple Zero Emergency Services' },
  { country: 'Singapore', code: 'SG', number: '995', description: 'SCDF Emergency Ambulance' },
];

interface EmergencyBannerProps {
  urgentTrigger?: {
    isOpen: boolean;
    reason?: string;
    action?: string;
  };
  onCloseUrgent?: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  urgentTrigger,
  onCloseUrgent,
}) => {
  const { t, isRTL } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<EmergencyContact>(EMERGENCY_NUMBERS[0]);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [showDisclaimerDrawer, setShowDisclaimerDrawer] = useState(false);

  return (
    <>
      {/* Top Universal Safety Strip */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-semibold text-rose-300 shrink-0">{t.safetyNotice}</span>
            <span className="hidden sm:inline text-slate-300">
              {t.safetyBannerText}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDisclaimerDrawer(true)}
              className="text-slate-300 hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
            >
              {t.medicalLimitations}
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 bg-rose-950/80 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-800/80">
              <Phone className="w-3 h-3 text-rose-400 shrink-0" />
              <span>{t.emergencyNotice} ({selectedCountry.code}):</span>
              <a
                href={`tel:${selectedCountry.number}`}
                className="font-bold text-white hover:underline mx-0.5 tracking-wide"
                title={`Dial ${selectedCountry.number} directly`}
              >
                {selectedCountry.number}
              </a>
              <button
                onClick={() => setIsCountryModalOpen(true)}
                className="text-[10px] text-rose-300 hover:text-white underline cursor-pointer"
              >
                {t.emergencyChange}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Country Selector Modal */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg text-slate-900">Select Emergency Region</h3>
              </div>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Configure the 1-click dial number displayed across CareBridge AI. If you are experiencing a life-threatening emergency, call immediately.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {EMERGENCY_NUMBERS.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setSelectedCountry(item);
                    setIsCountryModalOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    selectedCountry.code === item.code
                      ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-medium'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {item.country}
                      <span className="text-xs font-normal text-slate-500">({item.code})</span>
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">{item.description}</div>
                  </div>
                  <div className="text-base font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs text-rose-600 font-mono">
                    {item.number}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Limitations Detailed Drawer */}
      {showDisclaimerDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-blue-900">
                <ShieldAlert className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg">{t.safetyModalTitle}</h3>
              </div>
              <button
                onClick={() => setShowDisclaimerDrawer(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 max-h-80 overflow-y-auto pr-2">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
                CareBridge AI is built for the Be10X Build for Good Hackathon as a healthcare navigation and accessibility prototype.
              </div>

              <p>
                <strong>1. Not a Licensed Medical Provider:</strong> CareBridge AI is not a doctor, hospital, emergency medical service, diagnostic device, or telemedicine provider. It does not possess medical licensing in any jurisdiction.
              </p>

              <p>
                <strong>2. No Definitive Diagnosis or Treatment:</strong> The application does not diagnose illness, predict patient prognosis, prescribe medications or dosages, change clinician orders, or declare that serious medical conditions have been ruled out.
              </p>

              <p>
                <strong>3. Navigation & Preparation Purpose:</strong> Its sole purpose is to help people organize their health concerns into clear, objective summaries for qualified clinicians, understand published pricing, and find nearby health facilities.
              </p>

              <p>
                <strong>4. Emergency Policy:</strong> If you or someone around you experiences severe chest pain, shortness of breath, sudden facial drooping or weakness, uncontrolled bleeding, or loss of consciousness, stop using this software and dial <strong>{selectedCountry.number}</strong> immediately.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowDisclaimerDrawer(false)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                {t.safetyModalAck}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Critical Red-Flag Interruption Modal (Auto-Triggered by Symptom Filter) */}
      {urgentTrigger?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-rose-500 text-slate-900 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider mb-1">
                  {t.emergencyInterruptionBadge}
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 leading-tight">
                  {t.emergencyInterruptionTitle}
                </h3>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 text-xs leading-relaxed space-y-2">
              <p className="font-semibold text-rose-900">
                {urgentTrigger.reason || 'Possible emergency warning signs detected in your message.'}
              </p>
              <p>
                {urgentTrigger.action || 'Please stop using this online guidance tool and seek immediate emergency medical evaluation.'}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs text-slate-600 font-medium">{t.emergencySafetyChecklistTitle}</div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>{t.emergencyProtocol1}</li>
                <li>{t.emergencyProtocol2}</li>
                <li>{t.emergencyProtocol3}</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${selectedCountry.number}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 text-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>{t.emergencyCallNow} ({selectedCountry.number})</span>
              </a>
              {onCloseUrgent && (
                <button
                  onClick={onCloseUrgent}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  {t.emergencyDismiss}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
