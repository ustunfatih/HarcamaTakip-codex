import React, { useRef, useEffect, useState } from 'react';

interface Option {
    id: string;
    label: string;
}

interface SegmentedControlProps {
    options: Option[];
    selectedId: string;
    onChange: (id: string) => void;
    className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedId, onChange, className = "" }) => {
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const selectedElement = container.querySelector(`[data-id="${selectedId}"]`) as HTMLElement;
        if (selectedElement) {
            setIndicatorStyle({
                width: `${selectedElement.offsetWidth}px`,
                transform: `translateX(${selectedElement.offsetLeft}px)`,
                height: `${selectedElement.offsetHeight}px`,
                top: `${selectedElement.offsetTop}px`,
            });
        }
    }, [selectedId, options]);

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center p-1 bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden no-scrollbar ${className}`}
            style={{ WebkitOverflowScrolling: 'touch' }}
        >
            <div
                className="absolute bg-white dark:bg-zinc-800 rounded-xl shadow-sm transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
                style={indicatorStyle}
            />
            {options.map((opt) => (
                <button
                    key={opt.id}
                    data-id={opt.id}
                    onClick={() => onChange(opt.id)}
                    className={`relative z-10 flex-1 flex items-center justify-center px-4 py-2.5 text-[11px] font-black uppercase transition-colors duration-200 whitespace-nowrap
            ${selectedId === opt.id ? 'text-emerald-600' : 'text-gray-400'}
          `}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
export default SegmentedControl;
