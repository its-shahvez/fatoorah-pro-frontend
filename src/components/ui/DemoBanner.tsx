import React from 'react';
import { FlaskConical, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const DemoBanner: React.FC = () => {
  const { lang } = useAppStore();
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-xs sm:text-sm font-medium flex items-center justify-between">
      <div className="flex items-center gap-2 mx-auto">
        <FlaskConical className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          {lang === 'en'
            ? '🧪 Demo Mode — No real ZATCA submission (All cryptographic stamps & clearances are simulated)'
            : '🧪 الوضع التجريبي — لا يوجد إرسال فعلي لهيئة الزكاة والضريبة والجمارك (ZATCA)'}
        </span>
      </div>
      <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
        <ShieldAlert className="w-3 h-3" /> SANDBOX MOCK
      </span>
    </div>
  );
};