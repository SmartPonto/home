import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, PunchType } from '../store/useStore';
import { Clock as ClockIcon, Coffee, Utensils, LogIn, LogOut, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PUNCH_OPTIONS: { type: PunchType; icon: React.ElementType; color: string; bg: string }[] = [
  { type: 'Entrada', icon: LogIn, color: 'text-emerald-600', bg: 'bg-emerald-100/50 hover:bg-emerald-100' },
  { type: 'Café da Manhã', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-100/50 hover:bg-amber-100' },
  { type: 'Volta do Café da Manhã', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100/50 hover:bg-blue-100' },
  { type: 'Almoço', icon: Utensils, color: 'text-rose-600', bg: 'bg-rose-100/50 hover:bg-rose-100' },
  { type: 'Volta do Almoço', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100/50 hover:bg-blue-100' },
  { type: 'Café da Tarde', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-100/50 hover:bg-amber-100' },
  { type: 'Volta do Café da Tarde', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100/50 hover:bg-blue-100' },
  { type: 'Saída', icon: LogOut, color: 'text-slate-600', bg: 'bg-slate-200/50 hover:bg-slate-200' },
];

export function PunchModal() {
  const currentEmployee = useStore((state) => state.currentEmployee);
  const setView = useStore((state) => state.setView);
  const addLocalPunch = useStore((state) => state.addLocalPunch);
  const setLastPunch = useStore((state) => state.setLastPunch);
  const localPunches = useStore((state) => state.localPunches);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's punches for this employee
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayPunches = localPunches.filter(p => 
    p.employeeId === currentEmployee?.id && 
    p.timestamp >= todayStart.getTime()
  );
  
  const punchedTypes = todayPunches.map(p => p.type);

  const handlePunch = (type: PunchType) => {
    if (!currentEmployee) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPunch = {
        id: crypto.randomUUID(),
        employeeId: currentEmployee.id,
        employeeName: currentEmployee.name,
        timestamp: Date.now(),
        type,
        synced: false
      };
      
      addLocalPunch(newPunch);
      setLastPunch(newPunch);
      setView('success');
      setIsSubmitting(false);
    }, 600);
  };

  if (!currentEmployee) {
    setView('kiosk');
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Olá, {currentEmployee.name}</h2>
            <p className="text-slate-500 mt-1">{currentEmployee.role}</p>
          </div>
          <button 
            onClick={() => setView('kiosk')}
            className="p-3 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="mb-8 flex items-center justify-center space-x-3 text-blue-600 bg-blue-50 py-4 rounded-2xl">
            <ClockIcon className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-wide">
              {format(new Date(), "HH:mm", { locale: ptBR })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PUNCH_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isPunched = punchedTypes.includes(option.type);
              
              return (
                <button
                  key={option.type}
                  onClick={() => handlePunch(option.type)}
                  disabled={isPunched || isSubmitting}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 group
                    ${isPunched 
                      ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed' 
                      : `border-transparent ${option.bg} hover:shadow-md hover:-translate-y-1`
                    }
                  `}
                >
                  <div className={`p-4 rounded-full mb-4 bg-white shadow-sm ${isPunched ? 'text-slate-400' : option.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className={`text-sm font-semibold text-center ${isPunched ? 'text-slate-400' : 'text-slate-700'}`}>
                    {option.type}
                  </span>
                  
                  {isPunched && (
                    <div className="absolute top-3 right-3 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
