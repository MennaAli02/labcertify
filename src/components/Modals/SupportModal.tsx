import React, { useState } from 'react';
import { X, LifeBuoy, Send, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { t, isRTL } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#C0CAD8] overflow-hidden text-start">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B96C7] to-[#0B96C7] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <LifeBuoy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl leading-tight">
                {isRTL ? "الدعم الفني والأكاديمي لمختبرات شلبي" : "Shalaby Support & Helpdesk"}
              </h3>
              <p className="text-xs text-white/80">
                {isRTL ? "دعم إكلينيكي متواصل 24/7" : "Clinical Onboarding Support 24/7"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#485261]">
                {isRTL ? "تم إرسال تذكرتك بنجاح!" : "Ticket Submitted Successfully!"}
              </h4>
              <p className="text-sm text-[#9995A6] max-w-xs mx-auto">
                {isRTL 
                  ? "سيقوم منسق التدريب الإكلينيكي بمراجعة استفسارك والرد خلال 15 دقيقة."
                  : "Our clinical onboarding coordinator will review your request within 15 minutes."}
              </p>
            </div>
          ) : (
            <>
              {/* Quick Contact Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#DEE2E8] rounded-2xl border border-[#C0CAD8] flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-[#0B96C7]" />
                  <div>
                    <span className="text-xs font-bold text-[#485261] block">
                      {isRTL ? "الخط الساخن للمختبر" : "Lab Hotline"}
                    </span>
                    <span className="text-[11px] text-[#9995A6]">{isRTL ? "تحويلة 4092" : "Ext. 4092"}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#DEE2E8] rounded-2xl border border-[#C0CAD8] flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-[#0B96C7]" />
                  <div>
                    <span className="text-xs font-bold text-[#485261] block">
                      {isRTL ? "المحادثة الفورية" : "Live Chat"}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {isRTL ? "متصل الآن" : "Online Now"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#485261] uppercase tracking-wider mb-1.5">
                    {isRTL ? "الموضوع / عنوان الاستفسار" : "Subject / Topic"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? "مثال: استفسار بخصوص تسلسل نزع معدات الوقاية PPE..." : "e.g. Question regarding Module 2 PPE sequence..."}
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#DEE2E8] border border-[#C0CAD8] focus:border-[#0B96C7] rounded-xl text-sm focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#485261] uppercase tracking-wider mb-1.5">
                    {isRTL ? "تفاصيل المشكلة أو السؤال" : "Details"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={isRTL ? "صف استفسارك أو مشكلتك الفنية بالتفصيل..." : "Describe your question or technical issue in detail..."}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#DEE2E8] border border-[#C0CAD8] focus:border-[#0B96C7] rounded-xl text-sm focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-semibold text-[#9995A6] hover:bg-[#DEE2E8] rounded-xl transition-colors cursor-pointer"
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0B96C7] hover:bg-[#0B96C7] text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    <span>{isRTL ? "إرسال التذكرة" : "Submit Ticket"}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
