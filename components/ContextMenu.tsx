import React, { useState, useRef, useEffect } from 'react';
import { Copy, Share, Tag, ExternalLink, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../utils';

export interface ContextMenuItem {
    icon: React.ReactNode;
    label: string;
    action: () => void;
    destructive?: boolean;
}

export interface ContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    position: { x: number; y: number };
    items: ContextMenuItem[];
    title?: string;
    subtitle?: string;
}

/**
 * HIG-style Context Menu with iOS blur background
 * Triggered by long-press on transactions or other interactive elements
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
    isOpen,
    onClose,
    position,
    items,
    title,
    subtitle,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    // Adjust position to keep menu in viewport
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const menu = menuRef.current;
            const rect = menu.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x = position.x;
            let y = position.y;

            // Keep menu within horizontal bounds
            if (x + rect.width > viewportWidth - 16) {
                x = viewportWidth - rect.width - 16;
            }
            if (x < 16) x = 16;

            // Keep menu within vertical bounds
            if (y + rect.height > viewportHeight - 16) {
                y = position.y - rect.height - 8;
            }
            if (y < 16) y = 16;

            setAdjustedPosition({ x, y });
        }
    }, [isOpen, position]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100]"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Bağlam menüsü"
        >
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200"
                style={{ animation: 'fadeIn 0.15s ease-out' }}
            />

            {/* Menu */}
            <div
                ref={menuRef}
                className="absolute min-w-[200px] max-w-[280px] rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    left: adjustedPosition.x,
                    top: adjustedPosition.y,
                    animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transformOrigin: 'top left',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Glass background */}
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
                    {/* Header if provided */}
                    {(title || subtitle) && (
                        <div className="px-4 py-3 border-b border-black/5 dark:border-white/10">
                            {title && (
                                <div className="text-[15px] font-semibold text-strong truncate">
                                    {title}
                                </div>
                            )}
                            {subtitle && (
                                <div className="text-[13px] text-muted truncate mt-0.5">
                                    {subtitle}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    onClose();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${item.destructive
                                        ? 'text-danger hover:bg-danger-soft active:bg-danger-soft'
                                        : 'text-strong hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/20'
                                    }
                  ${index !== items.length - 1 ? 'border-b border-black/5 dark:border-white/5' : ''}
                `}
                            >
                                <span className={`w-5 h-5 flex-shrink-0 ${item.destructive ? 'text-danger' : 'text-info'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[15px] font-medium">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cancel Button (iOS style separate) */}
                <div className="mt-2">
                    <button
                        onClick={onClose}
                        className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl py-3.5 text-[17px] font-semibold text-info hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                    >
                        Vazgeç
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(-8px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `}</style>
        </div>
    );
};

/**
 * Hook to enable long-press context menu
 */
export const useLongPress = (
    onLongPress: (e: React.TouchEvent | React.MouseEvent) => void,
    onClick?: () => void,
    options: { delay?: number } = {}
) => {
    const { delay = 500 } = options;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPressRef = useRef(false);
    const startPositionRef = useRef<{ x: number; y: number } | null>(null);

    const start = (e: React.TouchEvent | React.MouseEvent) => {
        isLongPressRef.current = false;

        // Get initial position
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        startPositionRef.current = { x: clientX, y: clientY };

        timerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            // Haptic feedback simulation - brief scale animation
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
            onLongPress(e);
        }, delay);
    };

    const move = (e: React.TouchEvent | React.MouseEvent) => {
        if (!startPositionRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const dx = Math.abs(clientX - startPositionRef.current.x);
        const dy = Math.abs(clientY - startPositionRef.current.y);

        // Cancel if moved too much (user is scrolling)
        if (dx > 10 || dy > 10) {
            cancel();
        }
    };

    const cancel = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        startPositionRef.current = null;
    };

    const end = () => {
        cancel();
        if (!isLongPressRef.current && onClick) {
            onClick();
        }
    };

    return {
        onTouchStart: start,
        onTouchMove: move,
        onTouchEnd: end,
        onMouseDown: start,
        onMouseMove: move,
        onMouseUp: end,
        onMouseLeave: cancel,
    };
};

/**
 * Transaction Context Menu - Pre-built menu for transactions
 */
export interface TransactionContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    position: { x: number; y: number };
    transaction: {
        payee: string;
        amount: number;
        date: string;
        category?: string;
        memo?: string;
    };
    onCopy?: () => void;
    onShare?: () => void;
    onCategorize?: () => void;
    onOpenInYnab?: () => void;
}

export const TransactionContextMenu: React.FC<TransactionContextMenuProps> = ({
    isOpen,
    onClose,
    position,
    transaction,
    onCopy,
    onShare,
    onCategorize,
    onOpenInYnab,
}) => {
    const items: ContextMenuItem[] = [
        {
            icon: <Copy className="w-full h-full" />,
            label: 'Kopyala',
            action: () => {
                const text = `${transaction.payee}: ${formatCurrency(transaction.amount)} (${transaction.date})`;
                navigator.clipboard.writeText(text);
                onCopy?.();
            },
        },
        {
            icon: <Share className="w-full h-full" />,
            label: 'Paylaş',
            action: () => {
                if (navigator.share) {
                    navigator.share({
                        title: transaction.payee,
                        text: `${transaction.payee}: ${formatCurrency(transaction.amount)}`,
                    });
                }
                onShare?.();
            },
        },
    ];

    if (onCategorize) {
        items.push({
            icon: <Tag className="w-full h-full" />,
            label: 'Kategorize Et',
            action: onCategorize,
        });
    }

    if (onOpenInYnab) {
        items.push({
            icon: <ExternalLink className="w-full h-full" />,
            label: "YNAB'da Aç",
            action: onOpenInYnab,
        });
    }

    return (
        <ContextMenu
            isOpen={isOpen}
            onClose={onClose}
            position={position}
            items={items}
            title={transaction.payee}
            subtitle={formatCurrency(transaction.amount)}
        />
    );
};

export default ContextMenu;
