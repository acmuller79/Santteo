import React, { useState } from 'react';
import { Lock, KeyRound, User, X, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const REQUIRED_USER = '97538325';
const REQUIRED_PASS = '9725';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (cleanUser === REQUIRED_USER && cleanPass === REQUIRED_PASS) {
      // Save session
      sessionStorage.setItem('santteo_admin_auth', 'true');
      setUsername('');
      setPassword('');
      setError(null);
      onSuccess();
    } else {
      setError('Usuário ou senha incorretos. Acesso restrito à administração.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-6 py-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Acesso Administrativo</h3>
              <p className="text-xs text-stone-400">Área restrita para configurações e produtos</p>
            </div>
          </div>
          <button
            onClick={() => {
              setError(null);
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/70 border border-red-800 rounded-2xl text-red-300 text-xs flex items-center gap-2.5 animate-in shake">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Usuário</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Digite o código de usuário"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Senha de Acesso</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <span>Entrar no Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-stone-500 hover:text-stone-400 transition-colors"
            >
              Cancelar e voltar para o site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
