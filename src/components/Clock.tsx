import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = format(time, 'HH:mm:ss');
  const dateString = format(time, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex flex-col items-center justify-center text-white space-y-4">
      <div className="text-7xl md:text-9xl font-mono font-bold tracking-tight drop-shadow-lg tabular-nums">
        {timeString}
      </div>
      <div className="text-xl md:text-3xl font-medium text-blue-100 capitalize tracking-wide drop-shadow-md">
        {dateString}
      </div>
    </div>
  );
}
