import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Search,
  Phone,
  ExternalLink,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Coins,
  Star,
  X,
  FileQuestion,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Facility, FacilitySearchParams } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

const POPULAR_HUBS = [
  'Delhi NCR',
  'Bengaluru',
  'Mumbai',
  'Hyderabad',
  'Chennai',
  'Pune',
];

const INSURANCE_PROVIDERS = [
  'Ayushman Bharat PM-JAY',
  'Central Government Health Scheme (CGHS)',
  'Star Health Insurance',
  'HDFC ERGO Health',
  'Care Health Insurance',
  'ICICI Lombard',
  'Niva Bupa Health',
  'Bajaj Allianz',
  'ESIC (Employees State Insurance)',
];

export const FacilityFinder: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const [params, setParams] = useState<FacilitySearchParams>({
    locationQuery: 'Delhi NCR',
    facilityType: 'all',
    budgetRange: 'any',
    insuranceType: 'any',
    insurancePlan: '',
    rankingPreference: 'balanced',
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSourceNotice, setDataSourceNotice] = useState<string>('');
  const [isLiveSearch, setIsLiveSearch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Insurance Checklist Drawer State
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  // Geolocation status
  const [geoState, setGeoState] = useState<'idle' | 'prompting' | 'granted' | 'denied'>('idle');

  const executeSearch = async (customParams?: FacilitySearchParams) => {
    const searchArgs = customParams || params;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/facilities/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchArgs),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve facility records.');
      }

      const data = await response.json();
      setFacilities(data.facilities || []);
      setDataSourceNotice(data.dataSource || '');
      setIsLiveSearch(data.isLiveResult || false);
    } catch (err: any) {
      console.error('Facility search error:', err);
      setErrorMessage('Unable to load facilities at this moment. Please check your query or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, []);

  const handleDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoState('prompting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoState('granted');
        const updated = {
          ...params,
          locationQuery: `Near current location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`,
        };
        setParams(updated);
        executeSearch(updated);
      },
      (err) => {
        console.warn('Geolocation permission rejected or timed out:', err);
        setGeoState('denied');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title & Scope */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.facFinderTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.facFinderSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsChecklistOpen(true)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <FileQuestion className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{t.btnPatientChecklist}</span>
        </button>
      </div>

      {/* Search Criteria Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch();
          }}
          className="space-y-5"
        >
          {/* Location row */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              {t.facLocationLabel}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className={`w-4 h-4 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3.5 text-slate-400`} />
                <input
                  type="text"
                  value={params.locationQuery}
                  onChange={(e) => setParams({ ...params, locationQuery: e.target.value })}
                  placeholder={t.facLocationPlaceholder}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500`}
                />
              </div>

              <button
                type="button"
                onClick={handleDeviceLocation}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Search using current device coordinates"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{geoState === 'granted' ? t.btnUsingGps : t.btnUseGps}</span>
              </button>
            </div>

            {/* Quick Hub Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 mr-1">Popular:</span>
              {POPULAR_HUBS.map((hub) => (
                <button
                  key={hub}
                  type="button"
                  onClick={() => {
                    const updated = { ...params, locationQuery: hub };
                    setParams(updated);
                    executeSearch(updated);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    params.locationQuery.toLowerCase().includes(hub.toLowerCase())
                      ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  {hub}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Facility Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.facCategoryLabel}
              </label>
              <select
                value={params.facilityType}
                onChange={(e) => setParams({ ...params, facilityType: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">{t.facCategoryAll}</option>
                <option value="hospital">{t.facCategoryHospital}</option>
                <option value="clinic">{t.facCategoryClinic}</option>
                <option value="general practitioner">{t.facCategoryGp}</option>
                <option value="diagnostic centre">{t.facCategoryLab}</option>
              </select>
            </div>

            {/* Budget Range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.facBudgetLabel}
              </label>
              <select
                value={params.budgetRange}
                onChange={(e) => setParams({ ...params, budgetRange: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="any">{t.facBudgetAny}</option>
                <option value="subsidized">{t.facBudgetSubsidized}</option>
                <option value="under_500">{t.facBudgetUnder500}</option>
                <option value="moderate">{t.facBudget500to1200}</option>
                <option value="higher">{t.facBudgetAbove1200}</option>
              </select>
            </div>

            {/* Insurance Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.facInsuranceLabel}
              </label>
              <select
                value={params.insuranceType}
                onChange={(e) => setParams({ ...params, insuranceType: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="any">{t.facInsuranceAny}</option>
                <option value="government">{t.facInsuranceGov}</option>
                <option value="private">{t.facInsurancePrivate}</option>
                <option value="none">{t.facInsuranceNone}</option>
                <option value="unsure">{t.facInsuranceUnsure}</option>
              </select>
            </div>

            {/* Ranking Preference */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.facRankingLabel}
              </label>
              <select
                value={params.rankingPreference}
                onChange={(e) => setParams({ ...params, rankingPreference: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="balanced">{t.facRankingBalanced}</option>
                <option value="lowest_cost">{t.facRankingLowestCost}</option>
                <option value="closest">{t.facRankingClosest}</option>
                <option value="highest_rating">{t.facRankingRating}</option>
                <option value="insurance_match">{t.facRankingInsurance}</option>
              </select>
            </div>
          </div>

          {/* Optional Specific Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.facPlanOptionalLabel}
              </label>
              <select
                value={params.insurancePlan}
                onChange={(e) => setParams({ ...params, insurancePlan: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="">{t.facPlanSelectPlaceholder}</option>
                {INSURANCE_PROVIDERS.map((ins) => (
                  <option key={ins} value={ins}>
                    {ins}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-6 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer h-[42px]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span>{t.searchingDirectory}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 shrink-0" />
                    <span>{t.btnSearchFacilities}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Directory Provenance & Notice Bar */}
      <div className="bg-slate-100 rounded-2xl p-3.5 sm:p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            <strong>Data Provenance:</strong> {dataSourceNotice || 'CareBridge AI Verified Directory'}
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Showing {facilities.length} verified results
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-5">
        {facilities.map((fac) => {
          const isGovVerified = fac.insurance.statusCode === 'verified_government';
          const isPrivVerified = fac.insurance.statusCode === 'verified_private';

          return (
            <div
              key={fac.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header: Name, Category, Rating */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                      {fac.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      approx. {fac.distanceKm} km away
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-500">{fac.address}</p>
                </div>

                {/* Rating Badge */}
                {fac.rating && (
                  <div className="flex sm:flex-col items-center sm:items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{fac.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {fac.userRatingCount.toLocaleString()} reviews
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Insurance Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Price Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-teal-600" /> {t.publishedTariffs}
                    </span>
                    <span className={fac.pricing.isVerifiedPrice ? 'text-teal-700' : 'text-amber-700'}>
                      {fac.pricing.isVerifiedPrice ? `● ${t.tariffVerified}` : `○ ${t.tariffUnverified}`}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {fac.pricing.consultationFee}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium text-slate-700">{t.diagnosticPackages}</span> {fac.pricing.diagnosticPackage}
                  </div>
                  <div className="text-[10px] text-slate-400 italic pt-0.5">
                    Source: {fac.pricing.priceSource}
                  </div>
                </div>

                {/* Insurance Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-teal-600" /> {t.facInsuranceLabel}
                    </span>
                    <span
                      className={`font-semibold ${
                        isGovVerified || isPrivVerified ? 'text-teal-700' : 'text-amber-700'
                      }`}
                    >
                      {isGovVerified
                        ? '● Gov Scheme Empanelled'
                        : isPrivVerified
                        ? '● Private TPA Empanelled'
                        : '○ Confirmation Required'}
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 leading-snug">
                    {fac.insurance.statusText}
                  </p>
                  {fac.insurance.empanelledSchemes.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {fac.insurance.empanelledSchemes.map((scheme, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-medium"
                        >
                          {scheme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Match Reason Banner */}
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p>
                  <strong>{t.whyThisMatched}</strong> {fac.matchReason}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {fac.phone && fac.phone !== 'Not published' && (
                    <a
                      href={`tel:${fac.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t.btnCall}: {fac.phone}</span>
                    </a>
                  )}

                  {fac.directionsUrl && (
                    <a
                      href={fac.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-700" />
                      <span>{t.btnDirections}</span>
                    </a>
                  )}

                  {fac.website && (
                    <a
                      href={fac.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.btnWebsite}</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setIsChecklistOpen(true)}
                  className="text-teal-700 hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <FileQuestion className="w-3.5 h-3.5" />
                  <span>{t.btnAskFacilityQuestions}</span>
                </button>
              </div>
            </div>
          );
        })}

        {facilities.length === 0 && !isLoading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-base text-slate-800">{t.noFacilitiesFound}</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t.noFacilitiesHint}
            </p>
            <button
              onClick={() => {
                const reset = {
                  locationQuery: 'Delhi NCR',
                  facilityType: 'all',
                  budgetRange: 'any',
                  insuranceType: 'any',
                  insurancePlan: '',
                  rankingPreference: 'balanced',
                };
                setParams(reset);
                executeSearch(reset);
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              {t.btnResetSearch}
            </button>
          </div>
        )}
      </div>

      {/* Patient Pre-Visit Checklist Modal */}
      {isChecklistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  {t.checklistModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsChecklistOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Never assume cashless coverage is guaranteed. Call the hospital’s TPA (Third-Party Administrator) insurance helpdesk before arrival and ask these four questions:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  1. "Is my specific insurance company and TPA currently active on your cashless network?"
                </div>
                <div className="text-slate-600">
                  Some hospitals suspend cashless ties with specific TPAs during rate negotiations. Verify current active status.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  2. "Does my policy require pre-authorization before outpatient (OPD) tests or daycare admission?"
                </div>
                <div className="text-slate-600">
                  Routine OPD doctor visits are often out-of-pocket unless your policy has a designated OPD rider.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  3. "What is the standard consultation fee for a first visit versus a follow-up review?"
                </div>
                <div className="text-slate-600">
                  Many facilities provide free or discounted follow-up within 7 days. Request an itemized receipt.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  4. "Can I fill prescribed medicines at generic Jan Aushadhi pharmacies outside the hospital?"
                </div>
                <div className="text-slate-600">
                  Hospital in-house pharmacies frequently stock branded formulations with higher margins. Ask for generic chemical names.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsChecklistOpen(false)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {t.checklistClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
