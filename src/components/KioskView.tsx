import React, { useState } from 'react';
import { Clock } from './Clock';
import { User, Lock, Clock as ClockIcon, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';

export function KioskView() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const setView = useStore((state) => state.setView);
  const setCurrentEmployee = useStore((state) => state.setCurrentEmployee);

  const view = useStore((state) => state.view);

  React.useEffect(() => {
    if (view === 'kiosk') {
      setPassword('');
      setCpf('');
    }
  }, [view]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const users = [
        { id: 'emp_001', name: 'Ryan francklin', role: 'Funcionário', cpf: '54184191886', pass: '171707' },
        { id: 'emp_002', name: 'Matheus Parreiras', role: 'Funcionário', cpf: '52557182893', pass: 'Vadisbetter01' },
        { id: 'emp_003', name: 'Thayná Oliveira', role: 'Funcionário', cpf: '58142816857', pass: '4002' }
      ];

      const user = users.find(u => u.cpf === cpf && u.pass === password);

      if (user) {
        setCurrentEmployee({
          id: user.id,
          name: user.name,
          role: user.role
        });
        setView('punch_modal');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-slate-50 overflow-hidden">
      {/* Left Panel - Clock */}
      <div className="lg:w-[60%] bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-hidden shadow-2xl z-10">
        <div className="absolute top-8 left-8 flex items-center space-x-3 text-white">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <ClockIcon className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold tracking-tight">SmartPonto Pro</span>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <Clock />
      </div>

      {/* Right Panel - Login */}
      <div className="lg:w-[40%] flex flex-col justify-center p-8 lg:p-16 relative z-20 bg-white shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.1)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Registar Ponto</h1>
            <p className="text-slate-500 text-lg">Insira as suas credenciais para bater o ponto.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">CPF ou Matrícula</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Digite o seu CPF ou Matrícula"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Digite a sua senha"
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
                'Aceder'
              )}
            </button>
          </form>
          
          <div className="mt-12 text-center">
            <button 
              onClick={() => setView('admin_login')}
              className="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Acesso Gestor</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
