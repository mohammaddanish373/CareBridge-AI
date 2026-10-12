/**
 * CareBridge AI - Supported Languages Definition
 */

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flagLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flagLabel: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flagLabel: 'हि' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', flagLabel: 'বা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr', flagLabel: 'த' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr', flagLabel: 'తె' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', dir: 'ltr', flagLabel: 'म' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', dir: 'ltr', flagLabel: 'ગુ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', dir: 'ltr', flagLabel: 'ਪੰ' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', dir: 'ltr', flagLabel: 'ಕ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', dir: 'ltr', flagLabel: 'മ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', flagLabel: 'رد' },
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguage(code: string): LanguageInfo {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}
