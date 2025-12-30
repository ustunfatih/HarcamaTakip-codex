import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import HapticButton from './HapticButton';

interface ListSelectorProps {
    label: string;
    value: string;
    displayValue: string;
    options: { id: string; label: string; sublabel?: string }[];
    onChange: (id: string) => void;
    icon?: React.ReactNode;
}

export const ListSelector: React.FC<ListSelectorProps> = ({ label, value, displayValue, options, onChange, icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-2">
            <div className="px-1 flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                {icon} <span>{label}</span>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 surface-card group active:scale-[0.98] transition-all"
            >
                <div className="flex flex-col items-start">
                    <span className="text-[17px] font-black text-[#191919] dark:text-white tracking-tight leading-tight">{displayValue}</span>
                </div>
                <ChevronRight size={18} className={`text-gray-300 transition-transform ${isOpen ? 'rotate-90 text-[#0f766e]' : ''}`} />
            </button>

            {isOpen && (
                <div className="pt-2 space-y-2 animate-spring-in">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { onChange(opt.id); setIsOpen(false); }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all
                ${value === opt.id ? 'bg-gradient-to-r from-teal-600 to-sky-500 text-white shadow-lg shadow-teal-500/20' : 'bg-black/5 dark:bg-white/5 text-gray-400 hover:opacity-100'}
              `}
                        >
                            <div className="flex flex-col items-start">
                                <span className={`text-sm font-black uppercase tracking-tight ${value === opt.id ? 'text-white' : 'text-[#191919] dark:text-white'}`}>{opt.label}</span>
                                {opt.sublabel && <span className={`text-[10px] font-bold ${value === opt.id ? 'text-white/60' : 'text-gray-400'}`}>{opt.sublabel}</span>}
                            </div>
                            {value === opt.id && <Check size={18} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ListSelector;
