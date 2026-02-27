import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PunchType = 
  | 'Entrada'
  | 'Café da Manhã'
  | 'Volta do Café da Manhã'
  | 'Almoço'
  | 'Volta do Almoço'
  | 'Café da Tarde'
  | 'Volta do Café da Tarde'
  | 'Saída';

export interface PunchRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  timestamp: number;
  type: PunchType;
  synced: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
}

interface AppState {
  view: 'kiosk' | 'punch_modal' | 'success' | 'admin_login' | 'admin_dashboard';
  setView: (view: 'kiosk' | 'punch_modal' | 'success' | 'admin_login' | 'admin_dashboard') => void;
  
  currentEmployee: Employee | null;
  setCurrentEmployee: (employee: Employee | null) => void;
  
  lastPunch: PunchRecord | null;
  setLastPunch: (punch: PunchRecord | null) => void;
  
  localPunches: PunchRecord[];
  addLocalPunch: (punch: PunchRecord) => void;
  markPunchSynced: (id: string) => void;
  
  isAdminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      view: 'kiosk',
      setView: (view) => set({ view }),
      
      currentEmployee: null,
      setCurrentEmployee: (employee) => set({ currentEmployee: employee }),
      
      lastPunch: null,
      setLastPunch: (punch) => set({ lastPunch: punch }),
      
      localPunches: [],
      addLocalPunch: (punch) => set((state) => ({ 
        localPunches: [...state.localPunches, punch] 
      })),
      markPunchSynced: (id) => set((state) => ({
        localPunches: state.localPunches.map(p => 
          p.id === id ? { ...p, synced: true } : p
        )
      })),
      
      isAdminAuthenticated: false,
      setAdminAuthenticated: (auth) => set({ isAdminAuthenticated: auth }),
    }),
    {
      name: 'smartponto-storage',
      partialize: (state) => ({ 
        localPunches: state.localPunches,
        isAdminAuthenticated: state.isAdminAuthenticated
      }),
    }
  )
);
