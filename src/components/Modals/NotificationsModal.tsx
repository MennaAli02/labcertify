import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { ViewType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { t, isRTL } = useLanguage();
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: isRTL ? 'إنجاز مرحلي في المقرر الثاني' : 'Module 2 Milestone Reached',
      message: isRTL ? 'أتممت 45% من مناولة ومعالجة العينات الطبية. استمر في التقدم!' : 'You completed 45% of Sample Handling & Processing. Keep going!',
      time: isRTL ? 'منذ 10 دقائق' : '10 mins ago',
      type: 'success',
      icon: CheckCircle,
      actionView: 'video_lesson' as ViewType,
      actionLabel: isRTL ? 'استئناف الدرس' : 'Resume Lesson',
    },
    {
      id: 'n2',
      title: isRTL ? 'رد جديد في منتدى القيادات' : 'Manager Forum Reply',
      message: isRTL ? 'قامت د. سارة المنصوري بالرد على موضوع نقاش نموذج GROW.' : 'Dr. Sarah Jenkins replied to the Coaching for Success discussion thread.',
      time: isRTL ? 'منذ ساعتين' : '2 hours ago',
      type: 'info',
      icon: Info,
      actionView: 'coaching' as ViewType,
      actionLabel: isRTL ? 'عرض النقاش' : 'View Discussion',
    },
    {
      id: 'n3',
      title: isRTL ? 'تقييم مرحلي معلق' : 'Knowledge Check Pending',
      message: isRTL ? 'السؤال 4 من 12 جاهز للحل في اختبار إجراءات الحماية الشخصية PPE.' : 'Question 4 of 12 is ready for your submission in PPE Dynamics.',
      time: isRTL ? 'منذ يوم' : '1 day ago',
      type: 'warning',
      icon: AlertCircle,
      actionView: 'quiz' as ViewType,
      actionLabel: isRTL ? 'بدء الاختبار' : 'Start Quiz',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#C0CAD8] overflow-hidden text-start">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#0B96C7] to-[#0B96C7] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg leading-tight">
                {isRTL ? "إشعارات المنظومة المخبرية" : "Clinical Notifications"}
              </h3>
              <p className="text-xs text-white/80">
                {isRTL ? "3 تنبيهات جديدة غير مقروءة" : "3 unread updates"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {notifications.map((n) => {
            const IconComponent = n.icon;
            return (
              <div 
                key={n.id}
                className="p-4 rounded-2xl bg-[#DEE2E8] border border-[#C0CAD8] hover:border-[#C0CAD8] transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      n.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                      n.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-sky-100 text-sky-700'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#485261]">
                        {n.title}
                      </h4>
                      <p className="text-xs text-[#485261] mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9995A6] whitespace-nowrap font-mono">
                    {n.time}
                  </span>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onNavigate(n.actionView);
                      onClose();
                    }}
                    className="text-xs font-semibold text-[#0B96C7] hover:text-[#0B96C7] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{n.actionLabel}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#DEE2E8] border-t border-[#C0CAD8] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#9995A6] hover:text-[#485261] cursor-pointer"
          >
            {isRTL ? "تحديد الكل كمقروء" : "Mark all as read"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0B96C7] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#0B96C7] transition-colors cursor-pointer"
          >
            {isRTL ? "إغلاق" : "Close"}
          </button>
        </div>

      </div>
    </div>
  );
};
