import React from "react";
import { Hexagon, Component } from "lucide-react";
import { downloadSVG, downloadPNG } from "../utils/downloadUtils";

interface DownloadSectionProps {
  projectName: string;
  setToastMessage: (msg: string) => void;
  hasDrawn: boolean;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  projectName,
  setToastMessage,
  hasDrawn,
}) => {
  const handleDownloadSVG = (type: "sygnet" | "logo") => {
    if (!hasDrawn) {
      setToastMessage("Brak elementów do eksportu!");
      return;
    }
    downloadSVG(type, projectName, setToastMessage);
  };

  const handleDownloadPNG = (type: "sygnet" | "logo") => {
    if (!hasDrawn) {
      setToastMessage("Brak elementów do eksportu!");
      return;
    }
    downloadPNG(type, projectName, setToastMessage);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2 mb-8">
      <button
        onClick={() => handleDownloadSVG("sygnet")}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#062D34] text-[#062D34] rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm"
      >
        <Hexagon className="w-5 h-5" /> Pobierz Sygnet (SVG)
      </button>
      <button
        onClick={() => handleDownloadPNG("sygnet")}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#062D34] text-[#062D34] rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm"
      >
        <Hexagon className="w-5 h-5" /> Pobierz Sygnet (PNG)
      </button>
      <button
        onClick={() => handleDownloadSVG("logo")}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#062D34] text-white rounded-lg font-semibold hover:bg-black transition shadow-sm"
      >
        <Component className="w-5 h-5" /> Pobierz Pełne Logo (SVG)
      </button>
      <button
        onClick={() => handleDownloadPNG("logo")}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#062D34] text-white rounded-lg font-semibold hover:bg-black transition shadow-sm"
      >
        <Component className="w-5 h-5" /> Pobierz Pełne Logo (PNG)
      </button>
    </div>
  );
};
