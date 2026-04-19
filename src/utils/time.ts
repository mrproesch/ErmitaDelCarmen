import { useState, useEffect } from 'react';

export const getGMT6Time = () => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const gmt6Date = new Date(utc - 21600000); // GMT-6 is -21,600,000 ms from UTC
  return gmt6Date.getHours() + gmt6Date.getMinutes() / 60 + gmt6Date.getSeconds() / 3600;
};

export function useTime() {
  const [time, setTime] = useState(getGMT6Time());
  
  useEffect(() => {
    // Update every 10 seconds since real time moves slowly
    const interval = setInterval(() => {
      setTime(getGMT6Time());
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return time;
}
