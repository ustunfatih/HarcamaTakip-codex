import React, { useState, useMemo } from 'react';
import { CategorySpending } from '../types';
import { formatCurrency } from '../utils';
import { ChevronRight, ShoppingCart, Car, Home, Zap, HeartPulse, ShoppingBag, Smartphone, Plane, GraduationCap, PawPrint, Gamepad2, UtensilsCrossed, CreditCard, Wallet, Baby, Gift, Music, Briefcase, Wifi, Coffee, PiggyBank } from 'lucide-react';

const COLORS = [
  { bg: '#e6f7f5', ic: '#0f766e' }, // Teal
  { bg: '#e0f2fe', ic: '#0ea5e9' }, // Sky
  { bg: '#ffedd5', ic: '#f97316' }, // Orange
  { bg: '#f1f5f9', ic: '#111827' }, // Charcoal
  { bg: '#fef3c7', ic: '#f59e0b' }, // Amber
  { bg: '#ecfdf3', ic: '#14b8a6' }  // Mint
];

const getIcon = (n: string) => {
  const s = n.toLowerCase();
  if (s.match(/market|gıda|bakkal/)) return ShoppingCart;
  if (s.match(/yemek|restoran|kafe|gurme/)) return UtensilsCrossed;
  if (s.includes('kahve')) return Coffee;
  if (s.match(/araba|yakıt|ulaşım|taksi/)) return Car;
  if (s.match(/kira|ev|aidat/)) return Home;
  if (s.match(/fatura|elektrik|su|gaz/)) return Zap;
  if (s.match(/internet|telefon|gsm/)) return Wifi;
  if (s.match(/sağlık|ilaç|hastane/)) return HeartPulse;
  if (s.match(/giyim|alışveriş|ayakkabı/)) return ShoppingBag;
  if (s.match(/teknoloji|elektronik/)) return Smartphone;
  if (s.match(/tatil|seyahat|uçak/)) return Plane;
  if (s.match(/eğitim|okul|kitap/)) return GraduationCap;
  if (s.match(/hayvan|kedi|köpek/)) return PawPrint;
  if (s.match(/eğlence|oyun|sinema|hobi/)) return Gamepad2;
  if (s.match(/çocuk|bebek/)) return Baby;
  if (s.includes('hediye')) return Gift;
  if (s.match(/müzik|spotify/)) return Music;
  if (s.match(/iş|ofis/)) return Briefcase;
  if (s.match(/birikim|yatırım/)) return PiggyBank;
  if (s.match(/kredi|kart|borç/)) return CreditCard;
  return Wallet;
};

export const CategoryCard: React.FC<{ category: CategorySpending, colorIndex: number }> = ({ category, colorIndex }) => {
  const [exp, setExp] = useState(false);
  const Icon = getIcon(category.categoryName);
  const color = COLORS[colorIndex % COLORS.length];
  const stats = useMemo(() => {
    const s: Record<string, number> = {};
    category.transactions?.forEach(t => {
      const p = t.payee_name || 'Bilinmeyen';
      s[p] = (s[p] || 0) + (-t.amount / 1000);
    });
    return Object.entries(s).map(([n, t]) => ({ n, t })).sort((a, b) => b.t - a.t).slice(0, 8);
  }, [category.transactions]);

  return (
    <div className="fintech-card fintech-card-hover overflow-hidden cursor-pointer" onClick={() => setExp(!exp)}>
      <div className="flex items-center p-4 gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color.bg }}><Icon size={24} color={color.ic} /></div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-black tracking-tight text-strong uppercase truncate">{category.categoryName}</h3>
          <p className="kicker-label">{category.transactions.length} İŞLEM</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-black text-lg tracking-tight">{formatCurrency(category.totalAmount)}</div>
          <ChevronRight size={16} className={`text-gray-300 transition-transform ${exp ? 'rotate-90' : ''}`} />
        </div>
      </div>
      {exp && (
        <div className="px-4 pb-4 animate-spring-in space-y-1">
          <div className="h-px bg-black/5 dark:bg-white/5 mb-3" />
          {stats.map((s, i) => (
            <div key={i} className="flex justify-between items-center py-2 px-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <span className="text-[13px] font-bold text-gray-500 uppercase truncate max-w-[200px]">{s.n}</span>
              <span className="text-[13px] font-black text-strong">{formatCurrency(s.t)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export const CATEGORY_CHART_COLORS = COLORS.map(c => c.ic);
