import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { currentLanguage, setLanguage, supportedLanguages, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200/80 cursor-pointer shadow-2xs"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language / भाषा बदलें"
      >
        <Globe className="w-4 h-4 text-teal-600 shrink-0" />
        <span className="font-semibold">{currentLanguage.nativeName}</span>
        {!compact && (
          <span className="text-[11px] text-slate-500 hidden md:inline">
            ({currentLanguage.name})
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isRTL ? 'left-0' : 'right-0'
          } mt-2 w-56 sm:w-64 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto`}
        >
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Select Language / भाषा चुनें
          </div>

          <div className="space-y-1">
            {supportedLanguages.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 text-teal-950 font-bold border border-teal-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  dir={lang.dir}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {lang.flagLabel}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{lang.nativeName}</div>
                      <div className="text-[11px] text-slate-500">{lang.name}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
