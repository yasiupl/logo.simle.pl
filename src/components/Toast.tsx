import React from "react";
import { Link } from "lucide-react";

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#062D34] text-[#D4CA05] px-6 py-3 rounded-md shadow-lg border border-[#D4CA05]/20 z-50 flex items-center gap-2 transition-opacity">
      <Link className="w-4 h-4" />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};
