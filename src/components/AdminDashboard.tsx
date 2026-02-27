import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useStore, PunchRecord, PunchType } from '../store/useStore';
import { LogOut, Download, Calendar, Users, Clock, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminDashboard() {
  const setView = useStore((state) => state.setView);
  const setAdminAuthenticated = useStore((state) => state.setAdminAuthenticated);
  const localPunches = useStore((state) => state.localPunches);

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setView('kiosk');
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localPunches, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "smartponto_backup_" + format(new Date(), 'yyyy-MM-dd') + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Group punches by employee and date
  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, Partial<Record<PunchType, number>>>> = {};
    
    localPunches.forEach(punch => {
      const dateStr = format(punch.timestamp, 'yyyy-MM-dd');
      const empKey = `${punch.employeeId}|${punch.employeeName}`;
      
      if (!groups[empKey]) groups[empKey] = {};
      if (!groups[empKey][dateStr]) groups[empKey][dateStr] = {};
      
      groups[empKey][dateStr][punch.type] = punch.timestamp;
    });
    
    return groups;
  }, [localPunches]);

  const tableColumns: PunchType[] = [
    'Entrada',
    'Café da Manhã',
    'Volta do Café da Manhã',
    'Almoço',
    'Volta do Almoço',
    'Café da Tarde',
    'Volta do Café da Tarde',
    'Saída'
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">SmartPonto | Gestão</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="w-4 h-4 mr-2 text-slate-500" />
              Exportar Backup
            </button>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Funcionários Ativos</p>
              <p className="text-2xl font-bold text-slate-900">{Object.keys(groupedData).length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Registos</p>
              <p className="text-2xl font-bold text-slate-900">{localPunches.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Dias Registados</p>
              <p className="text-2xl font-bold text-slate-900">
                {new Set(localPunches.map(p => format(p.timestamp, 'yyyy-MM-dd'))).size}
              </p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-900">Registos de Ponto</h3>
            <p className="text-sm text-slate-500 mt-1">Visualização detalhada dos registos por funcionário e data.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    Funcionário
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200">
                    Data
                  </th>
                  {tableColumns.map(col => (
                    <th key={col} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {Object.entries(groupedData).length === 0 ? (
                  <tr>
                    <td colSpan={tableColumns.length + 2} className="px-6 py-12 text-center text-slate-500">
                      Nenhum registo encontrado.
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupedData).flatMap(([empKey, dates]) => {
                    const [empId, empName] = empKey.split('|');
                    
                    return Object.entries(dates).map(([dateStr, punches], index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={`${empId}-${dateStr}`} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          <div className="flex flex-col">
                            <span>{empName}</span>
                            <span className="text-xs text-slate-400 font-mono mt-0.5">{empId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 border-r border-slate-200">
                          {format(new Date(dateStr + 'T12:00:00'), 'dd/MM/yyyy')}
                        </td>
                        {tableColumns.map(col => (
                          <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-mono">
                            {punches[col] ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-100">
                                {format(punches[col] as number, 'HH:mm')}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ));
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
