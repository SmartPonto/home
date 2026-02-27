import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Shield, Lock, ArrowLeft } from 'lucide-react';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const setView = useStore((state) => state.setView);
  const setAdminAuthenticated = useStore((state) => state.setAdminAuthenticated);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (password === 'admin123') {
        setAdminAuthenticated(true);
        setView('admin_dashboard');
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        
        <div className="p-8 sm:p-10">
          <button 
            onClick={() => setView('kiosk')}
            className="mb-8 p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Voltar ao Relógio</span>
          </button>
          
          <div className="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Painel do Gestor</h2>
          <p className="text-slate-500 mb-8">Insira a senha de administrador para aceder.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Senha de Acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Digite a senha"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-rose-500 text-sm font-medium px-2"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-600/20 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Aceder ao Painel'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
