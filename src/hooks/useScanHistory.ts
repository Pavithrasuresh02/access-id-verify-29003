import { useState, useEffect } from "react";

interface PPEStatus {
  helmet: boolean;
  gloves: boolean;
  boots: boolean;
}

interface AccessResult {
  worker_id: string;
  name: string;
  ppe_status: PPEStatus;
  access: "granted" | "denied";
  reason?: string;
  timestamp: string;
}

const STORAGE_KEY = "access_scan_history";
const MAX_HISTORY = 50;

export const useScanHistory = () => {
  const [history, setHistory] = useState<AccessResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addScan = (scan: AccessResult) => {
    setHistory((prev) => {
      const updated = [scan, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addScan, clearHistory };
};
