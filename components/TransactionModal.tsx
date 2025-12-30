import React, { useEffect, useRef, useState } from 'react';
import { X, Calendar, Tag, Flag, CreditCard, ArrowDownLeft, Copy, Share } from 'lucide-react';
import { YNABTransaction } from '../types';
import { formatCurrency } from '../utils';
import { ContextMenu, useLongPress, ContextMenuItem } from './ContextMenu';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: YNABTransaction[];
  categoryName: string;
  categoryColor?: string;
  totalAmount: number;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactions,
  categoryName,
  categoryColor = '#007AFF',
  totalAmount,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    transaction: YNABTransaction | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    transaction: null,
  });

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Long-press handler for transactions
  const handleTransactionLongPress = (tx: YNABTransaction, e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0]?.clientX || 100 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || 100 : e.clientY;

    setContextMenu({
      isOpen: true,
      position: { x: clientX, y: clientY },
      transaction: tx,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      transaction: null,
    });
  };

  // Generate context menu items for transaction
  const getContextMenuItems = (tx: YNABTransaction): ContextMenuItem[] => [
    {
      icon: <Copy className="w-full h-full" />,
      label: 'Kopyala',
      action: () => {
        const text = `${tx.payee_name || 'Bilinmeyen'}: ${formatCurrency(-tx.amount / 1000)} (${formatDate(tx.date)})`;
        navigator.clipboard.writeText(text);
      },
    },
    {
      icon: <Share className="w-full h-full" />,
      label: 'Paylaş',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: tx.payee_name || 'İşlem',
            text: `${tx.payee_name || 'Bilinmeyen'}: ${formatCurrency(-tx.amount / 1000)}`,
          });
        }
      },
    },
  ];

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFlagColor = (flag: string | null) => {
    const colors: Record<string, string> = {
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
    };
    return flag ? colors[flag] || 'bg-gray-400' : '';
  };

  // Transaction Row Component with long-press
  const TransactionRow: React.FC<{ tx: YNABTransaction }> = ({ tx }) => {
    const longPressHandlers = useLongPress(
      (e) => handleTransactionLongPress(tx, e),
      undefined,
      { delay: 500 }
    );

    return (
      <div
        {...longPressHandlers}
        className="flex items-center justify-between p-3 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-xl hover:bg-[#EBEBED] dark:hover:bg-[#3A3A3C] transition-colors min-h-[60px] cursor-pointer select-none long-press-target"
      >
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center gap-2">
            {tx.flag_color && (
              <div className={`w-2 h-2 rounded-full ${getFlagColor(tx.flag_color)}`} />
            )}
            <span className="text-[15px] font-medium text-[#1D1D1F] dark:text-white truncate">
              {tx.payee_name || 'Bilinmeyen'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3 h-3 text-[#8E8E93]" />
            <span className="text-[12px] text-[#6E6E73] dark:text-[#8E8E93]">
              {formatDate(tx.date)}
            </span>
            {tx.memo && (
              <>
                <span className="text-[#8E8E93]">•</span>
                <span className="text-[12px] text-[#8E8E93] truncate max-w-[120px]">
                  {tx.memo}
                </span>
              </>
            )}
          </div>
        </div>
        <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-white whitespace-nowrap">
          {formatCurrency(-tx.amount / 1000)}
        </span>
      </div>
    );
  };

  return (
    <>
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      >
        <div
          ref={modalRef}
          className="relative w-full sm:max-w-lg max-h-[85vh] bg-white dark:bg-[#1C1C1E] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${categoryColor}20` }}
                >
                  <Tag className="w-5 h-5" style={{ color: categoryColor }} />
                </div>
                <div>
                  <h2 id="modal-title" className="text-[17px] font-bold text-[#1D1D1F] dark:text-white">
                    {categoryName}
                  </h2>
                  <p className="text-[13px] text-[#6E6E73] dark:text-[#8E8E93]">
                    {transactions.length} işlem • Uzun basarak paylaş
                  </p>
                </div>
              </div>

              {/* 44pt touch target */}
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] rounded-full transition-colors -mr-2 -mt-1"
                aria-label="Kapat"
              >
                <X className="w-5 h-5 text-[#6E6E73] dark:text-[#8E8E93]" />
              </button>
            </div>

            {/* Total Banner */}
            <div className="px-4 pb-4">
              <div
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{ backgroundColor: `${categoryColor}10` }}
              >
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5" style={{ color: categoryColor }} />
                  <span className="text-[13px] font-medium text-[#6E6E73] dark:text-[#8E8E93]">
                    Toplam Harcama
                  </span>
                </div>
                <span className="text-[20px] font-bold" style={{ color: categoryColor }}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] overscroll-contain">
            <div className="p-4 space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-[#6E6E73]" />
                  </div>
                  <p className="text-[#6E6E73] dark:text-[#8E8E93]">İşlem bulunamadı</p>
                </div>
              ) : (
                transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))
              )}
            </div>
          </div>

          {/* iOS Safe Area Bottom */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.transaction && (
        <ContextMenu
          isOpen={contextMenu.isOpen}
          onClose={closeContextMenu}
          position={contextMenu.position}
          items={getContextMenuItems(contextMenu.transaction)}
          title={contextMenu.transaction.payee_name || 'İşlem'}
          subtitle={formatCurrency(-contextMenu.transaction.amount / 1000)}
        />
      )}
    </>
  );
};

export default TransactionModal;

