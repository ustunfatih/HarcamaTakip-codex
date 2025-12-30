import React from 'react';
import {
    FileText,
    Search,
    Calendar,
    TrendingUp,
    PiggyBank,
    FolderOpen,
    Inbox,
    Clock,
    AlertCircle,
    Plus
} from 'lucide-react';

export type EmptyStateType =
    | 'no-data'
    | 'no-transactions'
    | 'no-categories'
    | 'no-search-results'
    | 'error'
    | 'loading-failed'
    | 'no-scheduled'
    | 'no-goals'
    | 'first-time';

interface EmptyStateProps {
    type: EmptyStateType;
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const emptyStateConfig: Record<EmptyStateType, {
    icon: React.ReactNode;
    defaultTitle: string;
    defaultMessage: string;
    iconColor: string;
    bgGradient: string;
}> = {
    'no-data': {
        icon: <FileText className="w-10 h-10" />,
        defaultTitle: 'Veri Bulunamadı',
        defaultMessage: 'Henüz gösterilecek veri yok. Rapor oluşturmak için üstteki ayarları kullanın.',
        iconColor: 'text-[#0f766e]',
        bgGradient: 'from-emerald-500/10 to-teal-500/10',
    },
    'no-transactions': {
        icon: <Inbox className="w-10 h-10" />,
        defaultTitle: 'İşlem Bulunamadı',
        defaultMessage: 'Seçilen tarih aralığında işlem bulunmuyor. Farklı bir dönem deneyin.',
        iconColor: 'text-[#8E8E93]',
        bgGradient: 'from-gray-500/10 to-zinc-500/10',
    },
    'no-categories': {
        icon: <FolderOpen className="w-10 h-10" />,
        defaultTitle: 'Kategori Bulunamadı',
        defaultMessage: 'Bu dönemde kategorize edilmiş harcama bulunmuyor.',
        iconColor: 'text-[#FF9500]',
        bgGradient: 'from-orange-500/10 to-amber-500/10',
    },
    'no-search-results': {
        icon: <Search className="w-10 h-10" />,
        defaultTitle: 'Sonuç Bulunamadı',
        defaultMessage: 'Arama kriterlerinize uygun sonuç bulunamadı. Farklı bir arama deneyin.',
        iconColor: 'text-[#5856D6]',
        bgGradient: 'from-purple-500/10 to-violet-500/10',
    },
    'error': {
        icon: <AlertCircle className="w-10 h-10" />,
        defaultTitle: 'Bir Hata Oluştu',
        defaultMessage: 'Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
        iconColor: 'text-[#FF3B30]',
        bgGradient: 'from-red-500/10 to-rose-500/10',
    },
    'loading-failed': {
        icon: <AlertCircle className="w-10 h-10" />,
        defaultTitle: 'Yükleme Başarısız',
        defaultMessage: 'Veriler yüklenemedi. İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
        iconColor: 'text-[#FF3B30]',
        bgGradient: 'from-red-500/10 to-orange-500/10',
    },
    'no-scheduled': {
        icon: <Calendar className="w-10 h-10" />,
        defaultTitle: 'Planlanmış Ödeme Yok',
        defaultMessage: 'Gelecek dönemlere ait planlanmış ödeme bulunmuyor.',
        iconColor: 'text-[#34C759]',
        bgGradient: 'from-green-500/10 to-emerald-500/10',
    },
    'no-goals': {
        icon: <TrendingUp className="w-10 h-10" />,
        defaultTitle: 'Hedef Bulunamadı',
        defaultMessage: 'Henüz tanımlanmış tasarruf hedefi bulunmuyor.',
        iconColor: 'text-[#0f766e]',
        bgGradient: 'from-emerald-500/10 to-cyan-500/10',
    },
    'first-time': {
        icon: <PiggyBank className="w-10 h-10" />,
        defaultTitle: 'Hoş Geldiniz!',
        defaultMessage: 'Başlamak için YNAB hesabınızı bağlayın ve harcama raporlarınızı görün.',
        iconColor: 'text-[#34C759]',
        bgGradient: 'from-green-500/10 to-teal-500/10',
    },
};

/**
 * HIG-style Empty State component
 * Used when there's no data to display in a section
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
    type,
    title,
    message,
    actionLabel,
    onAction,
    className = '',
}) => {
    const config = emptyStateConfig[type];

    return (
        <div
            className={`
        flex flex-col items-center justify-center py-12 px-6 text-center
        ${className}
      `}
            role="status"
            aria-label={title || config.defaultTitle}
        >
            {/* Icon with gradient background */}
            <div
                className={`
          w-20 h-20 rounded-full flex items-center justify-center mb-5
          bg-gradient-to-br ${config.bgGradient}
          shadow-lg shadow-black/5 dark:shadow-black/20
        `}
            >
                <div className={config.iconColor}>
                    {config.icon}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-white mb-2">
                {title || config.defaultTitle}
            </h3>

            {/* Message */}
            <p className="text-[14px] text-[#6E6E73] dark:text-[#8E8E93] leading-relaxed max-w-[280px]">
                {message || config.defaultMessage}
            </p>

            {/* Action Button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#0f766e] text-white text-[15px] font-semibold rounded-full
            hover:bg-[#0b5f58] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="w-4 h-4" />
                    {actionLabel}
                </button>
            )}

            {/* Decorative dots */}
            <div className="flex gap-1.5 mt-8 opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
            </div>
        </div>
    );
};

/**
 * Inline Empty State - Smaller version for use in cards/sections
 */
export const InlineEmptyState: React.FC<{
    icon?: React.ReactNode;
    message: string;
    className?: string;
}> = ({ icon, message, className = '' }) => (
    <div
        className={`
      flex items-center gap-3 p-4 rounded-xl
      bg-[#F5F5F7] dark:bg-[#2C2C2E]
      border border-dashed border-black/10 dark:border-white/10
      ${className}
    `}
    >
        {icon && (
            <div className="w-8 h-8 flex items-center justify-center text-[#8E8E93] opacity-60">
                {icon}
            </div>
        )}
        <p className="text-[14px] text-[#8E8E93] dark:text-[#8E8E93]">
            {message}
        </p>
    </div>
);

export default EmptyState;
