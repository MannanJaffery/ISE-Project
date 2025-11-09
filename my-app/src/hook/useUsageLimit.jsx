// src/hooks/useUsageLimit.js
import { useState, useEffect } from "react";

export const useUsageLimit = (toolKey, limit = 2, resetHours = 1) => {
  const [usageCount, setUsageCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLimited, setIsLimited] = useState(false);

  // Helper to get stored data for this tool
  const getStoredData = () => {
    const data = JSON.parse(localStorage.getItem("usageLimits") || "{}");
    return data[toolKey] || { count: 0, resetTime: null };
  };

  // Helper to save data
  const saveData = (count, resetTime) => {
    const data = JSON.parse(localStorage.getItem("usageLimits") || "{}");
    data[toolKey] = { count, resetTime };
    localStorage.setItem("usageLimits", JSON.stringify(data));
  };

  // Initialize and check limit
  useEffect(() => {
    const { count, resetTime } = getStoredData();
    const now = Date.now();

    if (!resetTime || now > resetTime) {
      // Reset after 24 hours
      const newResetTime = now + resetHours * 60 * 60 * 1000;
      saveData(0, newResetTime);
      setUsageCount(0);
      setTimeLeft(resetHours * 60 * 60 * 1000);
      setIsLimited(false);
    } else {
      const remaining = resetTime - now;
      setTimeLeft(remaining);
      setUsageCount(count);
      setIsLimited(count >= limit);
    }

    // Timer to auto-update countdown
    const interval = setInterval(() => {
      const { resetTime } = getStoredData();
      if (resetTime) {
        const remaining = resetTime - Date.now();
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    }, 1000 * 60); // update every minute

    return () => clearInterval(interval);
  }, [toolKey, limit, resetHours]);

  // Function to increment usage when user uses a tool
  const incrementUsage = () => {
    const { count, resetTime } = getStoredData();
    const newCount = count + 1;
    saveData(newCount, resetTime);
    setUsageCount(newCount);
    if (newCount >= limit) setIsLimited(true);
  };

  // Format remaining time
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return {
    usageCount,
    limit,
    isLimited,
    hours,
    minutes,
    incrementUsage,
  };
};
