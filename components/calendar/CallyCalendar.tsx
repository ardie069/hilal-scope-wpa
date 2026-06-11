"use client";

import React, { useEffect, useRef } from "react";

// Mendaftarkan custom elements dari Cally (Hanya di client)
if (typeof window !== "undefined") {
  import("cally");
}

/**
 * CallyCalendar adalah wrapper untuk komponen kalender (Web Component)
 */


interface CallyCalendarProps {
  value?: string;
  onChange?: (date: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export default function CallyCalendar({ 
  value, 
  onChange, 
  children,
  className 
}: CallyCalendarProps) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleInput = (e: any) => {
      if (onChange) onChange(e.target.value);
    };

    el.addEventListener("change", handleInput);
    return () => el.removeEventListener("change", handleInput);
  }, [onChange]);

  // Sync value if changed from outside
  useEffect(() => {
    if (ref.current && value) {
      ref.current.value = value;
    }
  }, [value]);

  return (
    <calendar-date 
      ref={ref} 
      className={className}
      // Kita set default value ke ISO format YYYY-MM-DD
    >
      {children}
    </calendar-date>
  );
}
