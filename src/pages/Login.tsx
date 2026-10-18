import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  QrCode,
  FileCode2,
  Star,
  Globe,
  Zap,
  Award,
  Play,
  Code2,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { lang, toggleLang } = useAppStore();
  const [email, setEmail] = useState('demo@fatoorah.pro');
  const [password, setPassword] = useState('demo1234');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        lang === 'en'
          ? 'Welcome back, Ahmed Al-Faisal!'
          : 'مرحباً بك مجدداً، أحمد الفيصل!'
      );
      navigate('/dashboard');
    }, 500);
  };

  const testimonials = [
    {
      name: 'Tariq Al-Sulaiman',
      role: 'Chief Financial Officer, Riyadh Logistics Group',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      quote:
        'Fatoorah Pro migrated our 14 branches to ZATCA Phase 2 UBL 2.1 XML in less than 48 hours. The real-time TLV QR byte inspector saved our audit team weeks of testing.',
      rating: 5,
      city: 'Riyadh, KSA',
    },
    {
      name: 'Noura Al-Ghamdi',
      role: 'Head of Tax & VAT, Saudi Tech Solutions',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      quote:
        'The AI Fiscal Assistant and automated Form-01 VAT Return generator are game-changers. Our B2B Standard invoices clear in under 300 milliseconds.',
      rating: 5,
      city: 'Jeddah, KSA',
    },
    {
      name: 'Faisal Bin-Mahfouz',
      role: 'Managing Director, Arabian Steel Co.',
      avatar:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      quote:
        'Having an immutable SHA-256 hash-chain ledger with tamper detection gives our board 100% confidence during ZATCA inspections. Best Saudi SaaS UI we have used.',
      rating: 5,
      city: 'Dammam, KSA',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-white">
      {/* Top Sticky Landing Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-600/30">
            ف
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Fatoorah Pro
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              ZATCA Phase 2 Certified
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">
            Phase 2 Architecture
          </a>
          <a href="#showcase" className="hover:text-emerald-400 transition-colors">
            Enterprise Showcase
          </a>
          <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
            Saudi CFO Reviews
          </a>
          <a href="#developer" className="hover:text-emerald-400 transition-colors">
            Developer
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'en' ? 'عربي' : 'English'}</span>
          </button>
          <a
            href="#login-box"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            {lang === 'en' ? 'Launch App' : 'دخول المنصة'}
          </a>
        </div>
      </nav>

      {/* HERO SECTION + LOGIN PORTAL */}
      <section className="relative overflow-hidden py-14 lg:py-20 px-6 lg:px-16">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Vision 2030 Ready • ZATCA Fatoora Wave 2 Integration Engine
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              {lang === 'en' ? (
                <>
                  Saudi Arabia’s Most Advanced{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    ZATCA E-Invoicing
                  </span>{' '}
                  Platform.
                </>
              ) : (
                'منظومة الفوترة الإلكترونية الأحدث في المملكة العربية السعودية'
              )}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {lang === 'en'
                ? 'Generate OASIS UBL 2.1 XML invoices, encode binary TLV Base64 QR codes, verify cryptographic SHA-256 hash-chains, and automate 15% VAT returns in real time.'
                : 'أصدر فواتير ضريبية ومبسطة متوافقة ١٠٠٪ مع متطلبات المرحلة الثانية (الربط والتكامل) لهيئة الزكاة والضريبة والجمارك.'}
            </p>

            {/* Key Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <p className="text-2xl font-extrabold text-emerald-400">99.98%</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  First-Pass ZATCA Clearance
                </p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <p className="text-2xl font-extrabold text-white">Less than 250ms</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  ECDSA Cryptographic Stamp
                </p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl col-span-2 sm:col-span-1">
                <p className="text-2xl font-extrabold text-teal-400">SAR 4.2B+</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Annual B2B Volume Processed
                </p>
              </div>
            </div>

            {/* Riyadh Skyline Banner Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80"
                alt="Riyadh Kingdom Centre Financial District"
                className="w-full h-52 object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                      KINGDOM OF SAUDI ARABIA
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">
                      Built for Riyadh, Jeddah & Dammam Enterprises
                    </h3>
                    <p className="text-xs text-slate-300">
                      Full Arabic/English RTL support, Hijri Umm al-Qura calendar &
                      SAR VAT compliance
                    </p>
                  </div>
                  <button
                    onClick={handleLogin}
                    className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                    <span>Instant Live Demo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Interactive Login Card */}
          <div id="login-box" className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {lang === 'en' ? 'Sign In to Workspace' : 'تسجيل الدخول للمنصة'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Al Faisal Trading Est. • ZATCA Sandbox
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  DEMO READY
                </span>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    {lang === 'en' ? 'Work Email Address' : 'البريد الإلكتروني'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase">
                      {lang === 'en' ? 'Password / Passkey' : 'كلمة المرور'}
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      Pre-filled for Demo
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                >
                  <span>
                    {isLoading
                      ? 'Authenticating CSID Session...'
                      : lang === 'en'
                      ? 'Sign In & Open Dashboard'
                      : 'دخول لوحة التحكم'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                <p className="text-[11px] font-bold uppercase text-slate-400 text-center">
                  Included in Interactive Sandbox Session:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Live TLV QR Generator</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>UBL 2.1 XML Builder</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hash Tamper Simulator</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AI Invoice Copilot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ZATCA PHASE 2 ARCHITECTURE */}
      <section
        id="features"
        className="py-16 px-6 lg:px-16 bg-slate-900/70 border-y border-slate-800"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              BUILT FOR ZATCA PHASE 2 (INTEGRATION WAVE)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Every Cryptographic & Tax Specification, Engineered to Perfection
            </h2>
            <p className="text-sm text-slate-400">
              Unlike generic accounting tools, Fatoorah Pro implements binary
              Tag-Length-Value encoding, PIH hash chaining, and bilingual PDF/A-3
              rendering natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Binary TLV Base64 QR Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Encodes Tag 1 (Seller Name), Tag 2 (15-digit VAT), Tag 3 (ISO
                Timestamp), Tag 4 (Invoice Total), and Tag 5 (VAT Total) into raw
                UTF-8 byte arrays with a live decoder table.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileCode2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                OASIS UBL 2.1 XML & Hash Chain
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically embeds Invoice Counter Value (ICV), UUID, and Previous
                Invoice Hash (PIH) to prevent any unauthorized deletion or alteration
                of historical tax invoices.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                AI Assistant & Form-01 VAT Return
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste unstructured client orders to draft 15% VAT invoices with
                human-in-the-loop safety, and export quarterly ZATCA VAT Return Box
                1–14 worksheets in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VISUAL PHOTO SHOWCASE */}
      <section id="showcase" className="py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80"
              alt="Financial Audit Team"
              className="rounded-2xl h-64 w-full object-cover border border-slate-800 shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
              alt="Enterprise Analytics Dashboard"
              className="rounded-2xl h-64 w-full object-cover border border-slate-800 shadow-lg mt-6"
            />
          </div>

          <div className="space-y-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-emerald-400">
              <Award className="w-4 h-4" /> Designed for CFOs & Tax Auditors
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Dual-Mode Invoicing: Standard B2B Clearance & Simplified B2C Thermal POS
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you issue SAR 500,000 B2B construction contracts requiring
              real-time ZATCA clearance or high-volume retail POS receipts reported
              within 24 hours, Fatoorah Pro handles both workflows seamlessly.
            </p>
            <div className="pt-2">
              <a
                href="#login-box"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                <span>Explore Live Demo Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CUSTOMER TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-16 px-6 lg:px-16 bg-slate-900/60 border-t border-slate-800"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              TRUSTED ACROSS SAUDI ARABIA
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              What Finance Leaders in Riyadh & Jeddah Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    “{t.quote}”
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">
                      📍 {t.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: DEVELOPER & ARCHITECT SPOTLIGHT (MOHD SHAHVEZ) */}
      <section
        id="developer"
        className="py-14 px-6 lg:px-16 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border-t border-slate-800"
      >
        <div className="max-w-5xl mx-auto bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0">
              MS
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <Code2 className="w-3.5 h-3.5" /> Lead Full-Stack Engineer & Architect
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Developed by Mohd Shahvez
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  <Briefcase className="w-4 h-4" /> 2.9 Years of Experience at JPR Technosoft
                </span>
                <span className="text-slate-600">•</span>
                <span>Java Full Stack & Enterprise FinTech Systems</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="https://www.linkedin.com/in/mohdshahvez1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/its-shahvez"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <span>GitHub (@its-shahvez)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-16 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-600 rounded-lg text-white font-bold flex items-center justify-center text-xs">
            ف
          </div>
          <span className="font-bold text-white">Fatoorah Pro</span>
          <span>— ZATCA Phase 2 E-Invoicing SaaS</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <span>
            Developed by <strong className="text-emerald-400">Mohd Shahvez</strong> (2.9 Yrs Exp @ JPR Technosoft LLP)
          </span>
          <a
            href="https://www.linkedin.com/in/mohdshahvez1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-emerald-400 underline"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/its-shahvez"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-emerald-400 underline"
          >
            GitHub: its-shahvez
          </a>
        </div>
      </footer>
    </div>
  );
};