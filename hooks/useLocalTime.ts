import { useState, useEffect } from 'react';
import { MailingStatus } from '../types';

const getMailingStatus = (hour: number): MailingStatus => {
  if (hour >= 9 && hour < 17) {
    return MailingStatus.GOOD; // 9 AM to 5 PM
  }
  if (hour < 8 || hour > 22) {
    return MailingStatus.SLEEPING; // Before 8 AM or after 10 PM
  }
  return MailingStatus.BAD; // Other times
};

export const useLocalTime = (longitude: number) => {
  const [time, setTime] = useState({
    localTime: '--:--',
    mailingStatus: MailingStatus.BAD,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Estimate UTC offset from longitude. 15 degrees per hour.
      const utcOffset = Math.round(longitude / 15);
      
      // Calculate local time
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const localDate = new Date(utc + (3600000 * utcOffset));
      
      const hours = localDate.getHours();
      const minutes = localDate.getMinutes();

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const status = getMailingStatus(hours);
      
      setTime({
        localTime: formattedTime,
        mailingStatus: status,
      });
    };

    calculateTime(); // Initial calculation
    const interval = setInterval(calculateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [longitude]);

  return time;
};
