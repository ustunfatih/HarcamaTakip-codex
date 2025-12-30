import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular', width, height }) => {
    const variantClasses = {
        text: 'rounded h-3',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
        card: 'rounded-[24px]',
    };
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return <div className={`shimmer ${variantClasses[variant]} ${className}`} style={style} />;
};

export const SkeletonStatCard = () => (
    <div className="fintech-card p-5 space-y-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="80%" height={24} />
        </div>
    </div>
);

export const SkeletonCategoryCard = () => (
    <div className="fintech-card p-4 flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="30%" height={10} />
        </div>
        <Skeleton variant="text" width={80} height={20} />
    </div>
);

export const SkeletonReport = () => (
    <div className="w-full max-w-xl px-4 animate-pulse space-y-8 mt-6">
        <div className="flex flex-col items-center py-8 space-y-4">
            <Skeleton variant="text" width={100} height={12} />
            <Skeleton variant="text" width={240} height={64} />
            <div className="flex gap-8">
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="circular" width={48} height={48} />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
        </div>
        <div className="space-y-4">
            <SkeletonCategoryCard />
            <SkeletonCategoryCard />
            <SkeletonCategoryCard />
        </div>
    </div>
);

export default Skeleton;
