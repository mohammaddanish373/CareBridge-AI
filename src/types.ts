/**
 * CareBridge AI - Types & Data Contracts
 * Social Impact Healthcare Guidance & Access
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  emergencyDetails?: {
    reason?: string;
    action?: string;
  };
}

export interface ClinicianSummary {
  mainConcern: string;
  reportedSymptoms: string[];
  reportedDurationAndChanges: string;
  relevantAnswersProvided: string[];
  unansweredQuestions: string[];
  questionsToAskClinician: string[];
  cautiousNextStep: string;
  safetyNotice: string;
  englishVersion?: ClinicianSummary;
}

export interface FacilityPricing {
  consultationFee: string;
  feeType: string;
  diagnosticPackage: string;
  priceSource: string;
  isVerifiedPrice: boolean;
}

export interface FacilityInsurance {
  statusText: string;
  statusCode: 'verified_government' | 'verified_private' | 'network_not_verified' | 'coverage_requires_confirmation';
  empanelledSchemes: string[];
  cashlessSupported: boolean;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  rating: number | null;
  userRatingCount: number;
  phone: string;
  directionsUrl: string;
  website: string;
  distanceKm: number;
  pricing: FacilityPricing;
  insurance: FacilityInsurance;
  matchReason: string;
  isLive?: boolean;
}

export interface FacilitySearchParams {
  locationQuery: string;
  facilityType: string;
  budgetRange: string;
  insuranceType: string;
  insurancePlan: string;
  rankingPreference: string;
}

export interface ReportParameter {
  name: string;
  reportedValue: string;
  referenceRange?: string;
  plainLanguageMeaning: string;
  neutralObservation: string;
}

export interface ReportExplanation {
  reportType: string;
  overview: string;
  parameters: ReportParameter[];
  missingContextFactors: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'checkup' | 'lifestyle';
  dateTime: string;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface EmergencyContact {
  country: string;
  code: string;
  number: string;
  description: string;
}
