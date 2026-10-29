import { useState, useEffect } from 'react';

export function useLiveClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format in IST (Asia/Kolkata)
  const istTimeString = time.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + ' IST';

  const dayOfWeek = time.toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
  });

  const fullDateString = time.toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate day cycle (Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5)
  let dayCycle = 3; // default Wednesday
  const dayIndex = time.getDay(); // 0 is Sun, 1 is Mon, 2 is Tue, 3 is Wed, 4 is Thu, 5 is Fri, 6 is Sat
  if (dayIndex >= 1 && dayIndex <= 5) {
    dayCycle = dayIndex;
  }

  // Calculate countdown to given target "HH:MM" in IST today
  const getTimeRemainingString = (targetTimeStr: string): string => {
    try {
      const [th, tm] = targetTimeStr.split(':').map(Number);
      const nowParts = time.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }).split(':').map(Number);

      const targetTotalMins = th * 60 + tm;
      const nowTotalMins = nowParts[0] * 60 + nowParts[1];
      const diffMins = targetTotalMins - nowTotalMins;

      if (diffMins > 0) {
        if (diffMins > 60) {
          const h = Math.floor(diffMins / 60);
          const m = diffMins % 60;
          return `T-MINUS ${h}H ${m}M`;
        }
        return `T-MINUS ${diffMins} MINS`;
      } else if (diffMins >= -90) {
        return `IN PROGRESS`;
      } else {
        return `COMPLETED`;
      }
    } catch {
      return 'T-MINUS 24 MINS';
    }
  };

  return {
    time,
    istTimeString,
    dayOfWeek,
    fullDateString,
    dayCycle,
    getTimeRemainingString,
  };
}
