import React, { useState } from 'react';
import { ViewType, ForumPost } from '../../types';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  Download, 
  CheckCircle, 
  Play, 
  Lock, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  ChevronRight, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { mockForumPosts } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface CoachingModuleViewProps {
  onNavigate: (view: ViewType) => void;
}

export const CoachingModuleView: React.FC<CoachingModuleViewProps> = ({ onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [newComment, setNewComment] = useState('');

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.userLiked ? p.likes - 1 : p.likes + 1,
          userLiked: !p.userLiked
        };
      }
      return p;
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const post: ForumPost = {
      id: `post-${Date.now()}`,
      author: isRTL ? 'د. سارة المنصوري' : 'Dr. Sarah Al-Mansouri',
      role: isRTL ? 'أخصائي إكلينيكي أول' : 'SENIOR SPECIALIST',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGgUBhTHQtOx4cCa4r8Jj9pCBL-Z07YKFjSf7em3NxZFQBtPP7yBbC2SsxYkRTDWegzmmj71XVB3dpi_IYu_D8t8BPQ7I8UyXItx8YZXouwPh2NWBmAFs7dnZWj89DMN9ERFYIaEh1keS445KPjAGw6-N3oa1Nx8nBrViO0o3zWlrSeZOFMuygDnonqgSUJybRYiPUbwlxZWhYhMy4ttdfI8HVY0Qj1PTyoWDWwpxnu9hDQ2gzdUXRRA',
      timeAgo: isRTL ? 'الآن' : 'Just now',
      content: newComment,
      likes: 0,
      userLiked: false,
      replies: 0,
    };

    setPosts([post, ...posts]);
    setNewComment('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-start">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#6d797c]">
        <button onClick={() => onNavigate('dashboard')} className="hover:text-[#006672] cursor-pointer">
          {t.navDashboard}
        </button>
        <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        <button onClick={() => onNavigate('leadership_path')} className="hover:text-[#006672] cursor-pointer">
          {t.navLeadership}
        </button>
        <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        <span className="text-[#006672]">{t.coachingFramework}</span>
      </nav>

      {/* Main Module Header Card */}
      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#006672]/10 text-[#006672] text-xs font-bold rounded-full uppercase tracking-wider">
                {isRTL ? "المرحلة 02 • مقرر معتمد" : "Stage 02 • Certified Module"}
              </span>
              <span className="px-3 py-1 bg-[#4c56af]/10 text-[#4c56af] text-xs font-bold rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isRTL ? "المدة: ساعتان ونصف" : "2.5 hrs Duration"}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                5 CME Credits
              </span>
            </div>

            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191c1e]">
              {isRTL 
                ? "التوجيه للنجاح: تطبيق نموذج GROW وحلقات التغذية الراجعة" 
                : "Coaching for Success: GROW Model & Feedback Loops"}
            </h1>

            <p className="text-sm text-[#6d797c] max-w-3xl leading-relaxed">
              {isRTL 
                ? "تزويد قادة المختبرات بمنهجية تدريبية منظمة للبيئات الطبية. تعلم كيفية تحويل المواقف التشغيلية اليومية لفرص تطوير لكادر الفنيين باستخدام الاستماع النشط والتغذية الراجعة الفعالة."
                : "Equip yourself with structured coaching frameworks designed for clinical environments. Learn how to transform daily lab interactions into growth opportunities using active listening and empathetic feedback."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('video_lesson')}
              className="px-6 py-3 bg-[#006672] hover:bg-[#00818f] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t.resumeModule}</span>
            </button>
          </div>
        </div>

        {/* Target Competencies */}
        <div className="pt-4 border-t border-[#f2f4f6]">
          <h3 className="text-xs font-bold text-[#3d494b] uppercase tracking-wider mb-3">
            {isRTL ? "الجدارات القيادية المستهدفة" : "Target Competencies"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(isRTL ? [
              'الاستماع السريري الفعّال',
              'إطار تدريب GROW (الهدف، الواقع، الخيارات، المسار)',
              'حلقات التغذية الراجعة البناءة',
              'بناء عقلية النمو المهني',
              'بروتوكولات التهدئة وحل الخلافات'
            ] : [
              'Active Listening',
              'GROW Coaching Framework',
              'Feedback Loops',
              'Growth Mindset Catalyst',
              'De-escalation Protocols'
            ]).map((comp, i) => (
              <span key={i} className="px-3 py-1.5 bg-[#f2f4f6] text-[#191c1e] text-xs font-semibold rounded-xl border border-[#e0e3e5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#006672]" />
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Tools & Downloads Section */}
      <div className="bg-gradient-to-r from-[#006672]/5 to-[#4c56af]/5 rounded-3xl p-6 border border-[#e0e3e5]">
        <h2 className="font-headline font-bold text-lg text-[#191c1e] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#006672]" />
          <span>{isRTL ? "حقائب الأدوات القيادية والنماذج الجاهزة" : "Leadership Toolkits & Templates"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#e0e3e5] flex items-center justify-between gap-4 shadow-2xs hover:border-[#006672] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#006672]/10 text-[#006672] rounded-xl font-bold text-xs">
                PDF
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">
                  {isRTL ? "نموذج GROW التدريبي القابل للطباعة" : "GROW Model Template"}
                </h4>
                <p className="text-xs text-[#6d797c]">
                  {isRTL ? "مخطط إدارة جلسات التوجيه السريرية من 4 خطوات (1.4 MB)" : "Printable 4-step coaching session organizer (1.4 MB)"}
                </p>
              </div>
            </div>
            <a
              href="#download"
              onClick={(e) => { e.preventDefault(); alert(isRTL ? 'جاري تحميل نموذج GROW التدريبي...' : 'Downloading GROW Model Template PDF...'); }}
              className="p-2 text-[#006672] hover:bg-[#f2f4f6] rounded-xl transition-colors cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#e0e3e5] flex items-center justify-between gap-4 shadow-2xs hover:border-[#006672] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#4c56af]/10 text-[#4c56af] rounded-xl font-bold text-xs">
                PDF
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">
                  {isRTL ? "دليل نموذج التغذية الراجعة (SBI)" : "Feedback Canvas Guide"}
                </h4>
                <p className="text-xs text-[#6d797c]">
                  {isRTL ? "ورقة عمل الموقف - السلوك - الأثر التشغيلي (980 KB)" : "SBI (Situation-Behavior-Impact) worksheet (980 KB)"}
                </p>
              </div>
            </div>
            <a
              href="#download"
              onClick={(e) => { e.preventDefault(); alert(isRTL ? 'جاري تحميل دليل التغذية الراجعة...' : 'Downloading Feedback Canvas PDF...'); }}
              className="p-2 text-[#4c56af] hover:bg-[#f2f4f6] rounded-xl transition-colors cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Curriculum Lessons List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs space-y-4">
        <h2 className="font-headline font-bold text-xl text-[#191c1e]">
          {isRTL ? "محاضرات المقرر" : "Module Lessons"}
        </h2>

        <div className="space-y-3">
          {/* Lesson 1 */}
          <div className="p-4 rounded-2xl border border-[#e0e3e5] bg-[#f7f9fb] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">
                  {isRTL ? "الدرس 01: المبادئ الأساسية للتوجيه الإكلينيكي" : "Lesson 01: Foundational Coaching Principles"}
                </h4>
                <p className="text-xs text-[#6d797c]">
                  {isRTL 
                    ? "التحول من الإدارة التوجيهية الصرفة إلى التمكين القيادي الملهم. (35 دقيقة)"
                    : "Understanding the shift from directive management to empowering leadership. (35 mins)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('video_lesson')}
              className="px-3.5 py-1.5 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#3d494b] text-xs font-semibold rounded-xl cursor-pointer"
            >
              {isRTL ? "مراجعة" : "Review"}
            </button>
          </div>

          {/* Lesson 2 (Active) */}
          <div className="p-4 rounded-2xl border-2 border-[#006672] bg-[#006672]/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#006672] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                02
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#191c1e]">
                    {isRTL ? "الدرس 02: نموذج GROW في التطبيق العملي" : "Lesson 02: The GROW Model in Practice"}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#006672] text-white">
                    {isRTL ? "قيد الدراسة (65%)" : "In Progress (65%)"}
                  </span>
                </div>
                <p className="text-xs text-[#6d797c] mt-0.5">
                  {isRTL 
                    ? "الهدف، الواقع، الخيارات، وخطة العمل - دراسات حالة تطبيقية. (45 دقيقة)"
                    : "Goal, Reality, Options, and Way Forward interactive case studies. (45 mins)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('video_lesson')}
              className="px-4 py-2 bg-[#006672] hover:bg-[#00818f] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRTL ? 'rotate-180' : ''}`} />
              <span>{isRTL ? "استئناف" : "Resume"}</span>
            </button>
          </div>

          {/* Lesson 3 */}
          <div className="p-4 rounded-2xl border border-[#f2f4f6] bg-white opacity-70 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#bcc9cb] shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-[#191c1e]">
                  {isRTL ? "الدرس 03: حلقات التغذية الراجعة البناءة" : "Lesson 03: Constructive Feedback Loops"}
                </h4>
                <p className="text-xs text-[#6d797c]">
                  {isRTL 
                    ? "إتقان أساليب التقييم غير الدفاعية خلال الورديات الطبية الحرجة. (40 دقيقة)"
                    : "Mastering non-defensive feedback techniques in high-pressure lab shifts. (40 mins)"}
                </p>
              </div>
            </div>
            <span className="text-xs text-[#bcc9cb] font-semibold">
              {isRTL ? "مغلق" : "Locked"}
            </span>
          </div>
        </div>
      </div>

      {/* Manager's Forum Discussion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-xl text-[#191c1e] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#006672]" />
              <span>{isRTL ? "منتدى قادة المختبرات وتبادل الخبرات" : "Manager's Forum & Peer Insights"}</span>
            </h2>
            <p className="text-xs text-[#6d797c] mt-0.5">
              {isRTL 
                ? "ناقش سيناريوهات الإرشاد والتوجيه الواقعية مع زملاء العمل بمختبرات شلبي."
                : "Discuss real-world coaching scenarios with fellow lab leaders across Shalaby Labs locations."}
            </p>
          </div>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            placeholder={isRTL ? "شارك رؤيتك التوجيهية أو اطرح استفساراً لقيادات المختبر..." : "Share your coaching insights or ask a question..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[#f7f9fb] border border-[#bcc9cb] focus:border-[#006672] rounded-2xl text-sm focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#006672] hover:bg-[#00818f] text-white text-xs font-bold rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{isRTL ? "نشر" : "Post"}</span>
          </button>
        </form>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatarUrl}
                    alt={post.author}
                    className="w-9 h-9 rounded-full object-cover border border-[#006672]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#191c1e]">{post.author}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#006672]/10 text-[#006672] rounded">
                        {post.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6d797c] font-mono">{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#3d494b] leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center gap-4 pt-2 text-xs text-[#6d797c]">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    post.userLiked ? 'bg-[#006672]/15 text-[#006672] font-bold' : 'hover:bg-[#e0e3e5]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes} {isRTL ? "مفيد" : "Helpful"}</span>
                </button>

                <button className="flex items-center gap-1.5 px-3 py-1 hover:bg-[#e0e3e5] rounded-full transition-colors cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.replies} {isRTL ? "ردود" : "Replies"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
