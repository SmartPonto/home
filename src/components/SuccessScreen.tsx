import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function SuccessScreen() {
  const setView = useStore((state) => state.setView);
  const lastPunch = useStore((state) => state.lastPunch);
  const setCurrentEmployee = useStore((state) => state.setCurrentEmployee);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentEmployee(null);
      setView('kiosk');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [setView, setCurrentEmployee]);

  if (!lastPunch) return null;

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 12, stiffness: 200 }}
          className="mx-auto w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Ponto Confirmado!</h2>
        <p className="text-slate-500 mb-8">O seu registo foi guardado com sucesso.</p>
        
        <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Funcionário</p>
            <p className="text-lg font-semibold text-slate-900">{lastPunch.employeeName}</p>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tipo</p>
              <p className="text-lg font-semibold text-blue-600">{lastPunch.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Hora</p>
              <div className="flex items-center space-x-1 text-slate-900">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-lg font-mono font-semibold">
                  {format(lastPunch.timestamp, "HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
            className="h-1 bg-emerald-500 rounded-full mx-auto"
          />
          <p className="text-xs text-slate-400 mt-4">Redirecionando automaticamente...</p>
        </div>
      </motion.div>
    </div>
  );
}
