import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  storageKey?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title, subtitle, icon, defaultExpanded = true, children, badge, badgeColor = 'bg-emerald-600', storageKey,
}) => {
  const uniqueId = useId();
  const sectionId = storageKey || `section-${uniqueId}`;
  const [isExpanded, setIsExpanded] = useState(() => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`section_${storageKey}`);
      if (stored !== null) return stored === 'true';
    }
    return defaultExpanded;
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        setContentHeight(contentRef.current.scrollHeight);
        const timer = setTimeout(() => setContentHeight('auto'), 350);
        return () => clearTimeout(timer);
      } else {
        setContentHeight(contentRef.current.scrollHeight);
        requestAnimationFrame(() => requestAnimationFrame(() => setContentHeight(0)));
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(`section_${storageKey}`, String(isExpanded));
    }
  }, [isExpanded, storageKey]);

  return (
    <div className="mb-6" role="region">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 group focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-gray-500 group-active:scale-95 transition-all`}>
              {icon}
            </div>
          )}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black uppercase tracking-widest text-gray-400">
                {title}
              </span>
              {badge && (
                <span className={`px-2 py-0.5 text-[10px] font-black text-white rounded-full ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <span className="text-[11px] font-bold text-gray-400/60 uppercase tracking-tighter">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={16} className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-emerald-500' : ''}`} />
      </button>

      <div
        className="overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
        style={{
          maxHeight: isExpanded ? (contentHeight === 'auto' ? 'none' : `${contentHeight}px`) : '0px',
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateY(0)' : 'translateY(-4px)',
        }}
      >
        <div ref={contentRef} className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
