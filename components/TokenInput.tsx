import React, { ChangeEvent, FormEvent } from 'react';
import { Key, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import HapticButton from './HapticButton';

interface TokenInputProps {
    token: string;
    setToken: (token: string) => void;
    onContinue: (token: string) => void;
    isLoading: boolean;
    error: string | null;
}

export const TokenInput: React.FC<TokenInputProps> = ({ token, setToken, onContinue, isLoading, error }) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onContinue(token);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setToken(e.target.value);
    };

    return (
        <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto animate-spring-in">
            <div className="flex-1 flex flex-col justify-center pt-20">
                <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl display-title mb-4 text-strong">Harika bir analize hazır mısınız?</h1>
                <p className="text-gray-500 font-medium leading-relaxed mb-12">YNAB Personal Access Token'ınızı kullanarak verilerinizi güvenle senkronize edelim.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative surface-card p-1">
                        <input
                            type="password"
                            value={token}
                            onChange={handleChange}
                            className="w-full bg-transparent border-none px-4 py-4 text-lg font-bold focus:outline-none placeholder:text-gray-300 text-strong"
                            placeholder="Erişim Token'ı"
                            required
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 dark:bg-red-500/10 p-4 rounded-xl">
                            <AlertCircle size={16} /> <span>{error}</span>
                        </div>
                    )}
                </form>
            </div>

            <div className="pb-safe pt-8">
                <HapticButton
                    onClick={() => onContinue(token)}
                    disabled={isLoading || !token}
                    className={`w-full h-14 rounded-full font-black text-lg transition-all flex justify-center items-center shadow-lg btn-primary
            ${isLoading || !token ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 shadow-none' : 'text-white shadow-emerald-500/20'}
          `}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Devam Et'}
                </HapticButton>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Verileriniz yerel olarak işlenir</p>
            </div>
        </div>
    );
};
export default TokenInput;
