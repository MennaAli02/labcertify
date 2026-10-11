import React, { useState } from 'react';
import { ViewType, UserProfile } from '../../types';
import { 
  Award, 
  Download, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  Printer,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { LOGO_URL, SIGNATURE_URL, mockOfficialCertificates } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface CertificateViewProps {
  user: UserProfile;
  onNavigate: (view: ViewType) => void;
  selectedCourseId?: string;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ 
  user, 
  onNavigate,
  selectedCourseId = "course-1" 
}) => {
  const { t, isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Look up certificate for selected course, or default to course 1 or master
  const certRecord = mockOfficialCertificates[selectedCourseId] || mockOfficialCertificates["course-1"];
  const certId = certRecord.certificateId || `SL-CERT-2024-${user.employeeId.replace('SL-', '')}-1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://shalabylabs.org/verify/${certId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLinkedIn = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Controls Header (Hidden in Print) */}
      <div className="print:hidden bg-white rounded-2xl p-5 border border-[#c0cad8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
        <div>
          <span className="text-[11px] font-bold text-[#0B96C7] uppercase tracking-wider block font-mono">
            {t.officialCert} · ISO 15189:2022
          </span>
          <h1 className="font-bold text-xl sm:text-2xl text-[#485261] tracking-tight">
            {t.certOfCompletion}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handlePrintCertificate}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{t.downloadPrintPdf}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden md:inline">{copied ? t.certCopied : t.certCopyLink}</span>
          </button>

          <button
            onClick={handleShareLinkedIn}
            className="px-3.5 py-2 bg-[#dee2e8] hover:bg-[#dee2e8] text-[#0B96C7] text-xs font-semibold rounded-lg border border-[#c0cad8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">{t.share}</span>
          </button>
        </div>
      </div>

      {/* Share Toast Popup */}
      {shareToast && (
        <div className="bg-emerald-700 text-white p-3.5 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{isRTL ? "تم نسخ رابط التحقق من الشهادة بنجاح!" : "Certificate verification link copied! Ready to share."}</span>
          </div>
          <button onClick={() => setShareToast(false)} className="underline cursor-pointer">
            {isRTL ? "إغلاق" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Official Certificate Visual Canvas Frame */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-8 border border-[#c0cad8] shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Decorative Inner Border Line */}
        <div className="border border-[#c0cad8] p-6 sm:p-10 rounded-2xl relative bg-white">
          
          {/* Top Brand & Accreditation Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start border-b border-[#c0cad8]/60 pb-6">
            <div className="flex items-center gap-3.5">
              <img
                src={LOGO_URL}
                alt="Shalaby Labs"
                className="h-10 w-auto object-contain"
              />
              <div className={`${isRTL ? 'border-r pr-3' : 'border-l pl-3'} border-[#c0cad8]`}>
                <span className="font-bold text-sm text-[#0B96C7] tracking-wider block">
                  SHALABY CLINICAL LABORATORIES
                </span>
                <span className="text-[11px] text-[#485261] font-medium block">
                  Center for Diagnostic Quality & Laboratory Training · CAP #8472910
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.certStatusActive}</span>
            </div>
          </div>

          {/* Certificate Body Text */}
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-6 w-full">
            
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#485261] block text-center w-full">
              {t.certTitle}
            </span>

            <p className="text-xs sm:text-sm text-[#485261] text-center w-full">
              {t.certCertifiesThat}
            </p>

            {/* Recipient Full Name */}
            <div className="py-1 text-center w-full flex flex-col items-center justify-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B96C7] tracking-tight text-center w-full">
                {isRTL && user.nameAr ? user.nameAr : user.name}
              </h2>
              <p className="text-xs font-semibold text-[#485261] mt-1.5 text-center w-full">
                {t.employeeId}: {user.employeeId} • {isRTL && user.departmentAr ? user.departmentAr : user.department}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#485261] max-w-xl mx-auto leading-relaxed text-center w-full">
              {t.certHasFulfilled}
            </p>

            {/* Course Title Badge */}
            <div className="py-3.5 px-6 bg-[#6BBADA]/10 border border-[#6BBADA] rounded-2xl max-w-2xl mx-auto shadow-2xs w-full text-center">
              <h3 className="text-base sm:text-lg font-bold text-[#485261] text-center">
                {isRTL && certRecord.courseTitleAr ? certRecord.courseTitleAr : certRecord.courseTitle}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-1.5 text-xs text-[#0B96C7] font-semibold text-center">
                <span>{isRTL ? `الدرجة المحققة: ${certRecord.score}%` : `Demonstrated Score: ${certRecord.score}%`}</span>
                <span>•</span>
                <span>{isRTL ? `حد النجاح المطلوب: ${certRecord.passingScore}%` : `Passing Standard: ${certRecord.passingScore}%`}</span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-[#9995A6] max-w-lg mx-auto italic text-center w-full">
              {t.certAccreditation}
            </p>

          </div>

          {/* Signatures & QR Code Section */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center sm:text-start">
            
            {/* Signature 1 */}
            <div className="space-y-1 flex flex-col items-center sm:items-start">
              <img
                src={SIGNATURE_URL}
                alt="Authorized Signature"
                className="h-10 w-auto object-contain opacity-95"
              />
              <p className="text-xs font-bold text-[#485261] pt-1">
                {isRTL && certRecord.authorizedSignerAr ? certRecord.authorizedSignerAr : certRecord.authorizedSigner}
              </p>
              <p className="text-[11px] text-[#9995A6]">
                {t.certChiefMedicalOfficer}
              </p>
            </div>

            {/* Electronic QR Verification Block */}
            <div 
              onClick={() => setShowQrModal(true)}
              className="flex flex-col items-center justify-center space-y-1.5 cursor-pointer group"
              title="Click to verify QR"
            >
              {/* Geometric QR Matrix Pattern */}
              <div className="p-2.5 bg-white border border-[#0B96C7] rounded-xl shadow-2xs group-hover:scale-105 transition-transform">
                <svg className="w-14 h-14" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer corner anchors */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#0B96C7" />
                  <rect x="9" y="9" width="18" height="18" fill="white" />
                  <rect x="13" y="13" width="10" height="10" fill="#0B96C7" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#0B96C7" />
                  <rect x="73" y="9" width="18" height="18" fill="white" />
                  <rect x="77" y="13" width="10" height="10" fill="#0B96C7" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#0B96C7" />
                  <rect x="9" y="73" width="18" height="18" fill="white" />
                  <rect x="13" y="77" width="10" height="10" fill="#0B96C7" />

                  {/* Random QR data points */}
                  <rect x="36" y="8" width="6" height="6" fill="#0B96C7" />
                  <rect x="46" y="8" width="6" height="6" fill="#0B96C7" />
                  <rect x="56" y="8" width="6" height="6" fill="#0B96C7" />
                  <rect x="36" y="20" width="6" height="6" fill="#0B96C7" />
                  <rect x="50" y="22" width="6" height="6" fill="#0B96C7" />
                  
                  <rect x="10" y="38" width="6" height="6" fill="#0B96C7" />
                  <rect x="22" y="38" width="6" height="6" fill="#0B96C7" />
                  <rect x="36" y="38" width="6" height="6" fill="#0B96C7" />
                  <rect x="46" y="38" width="6" height="6" fill="#0B96C7" />
                  <rect x="60" y="38" width="6" height="6" fill="#0B96C7" />
                  <rect x="74" y="38" width="6" height="6" fill="#0B96C7" />
                  <rect x="84" y="38" width="6" height="6" fill="#0B96C7" />

                  <rect x="36" y="52" width="6" height="6" fill="#0B96C7" />
                  <rect x="48" y="52" width="6" height="6" fill="#0B96C7" />
                  <rect x="62" y="52" width="6" height="6" fill="#0B96C7" />
                  <rect x="76" y="52" width="6" height="6" fill="#0B96C7" />

                  <rect x="36" y="68" width="6" height="6" fill="#0B96C7" />
                  <rect x="48" y="76" width="6" height="6" fill="#0B96C7" />
                  <rect x="64" y="68" width="6" height="6" fill="#0B96C7" />
                  <rect x="76" y="78" width="6" height="6" fill="#0B96C7" />
                  <rect x="86" y="68" width="6" height="6" fill="#0B96C7" />
                </svg>
              </div>

              <span className="text-[11px] font-bold text-[#0B96C7] flex items-center gap-1 group-hover:underline">
                <QrCode className="w-3.5 h-3.5 text-[#0B96C7]" />
                <span>{t.qrScanToVerify}</span>
              </span>
            </div>

            {/* Credential ID & Issue Date */}
            <div className="space-y-0.5 text-center sm:text-end">
              <span className="text-[10px] text-[#9995A6] uppercase tracking-wider block font-bold">
                {t.credentialIdLabel}
              </span>
              <p className="font-mono text-xs font-black text-[#0B96C7] tracking-wider">
                {certId}
              </p>
              <p className="text-[11px] text-[#485261] font-medium pt-1">
                {t.certIssuedOn}: {certRecord.issueDate}
              </p>
              {certRecord.expiryDate && (
                <p className="text-[10px] text-[#9995A6]">
                  Valid Until: {certRecord.expiryDate}
                </p>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* QR Code Verification Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#C0CAD8] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-[#485261]">
                {t.certDigitalVerification}
              </h3>
              <p className="text-xs text-[#9995A6] mt-1">
                {isRTL ? 'امسح الرمز للتحقق الفوري من صحة ومطابقة الشهادة بسجلات معامل شلبي المركزية' : 'Scan this code to verify authenticity in the central Shalaby Labs credentials database.'}
              </p>
            </div>

            <div className="p-4 bg-[#DEE2E8] rounded-2xl border border-[#C0CAD8] space-y-2">
              <p className="font-mono text-xs font-bold text-[#0B96C7]">{certId}</p>
              <p className="text-[11px] text-[#9995A6]">{user.name} • {certRecord.courseCode}</p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.verificationBadge}</span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0B96C7] text-white text-xs font-bold hover:bg-[#087fa8] transition-all"
            >
              {isRTL ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
