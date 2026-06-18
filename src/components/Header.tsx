import React from "react";
import { Palette, Trash2, Link } from "lucide-react";

interface HeaderProps {
  clearCanvas: () => void;
  copyShareLink: () => void;
}

export const Header: React.FC<HeaderProps> = ({ clearCanvas, copyShareLink }) => {
  return (
    <header className="bg-[#062D34] text-white p-6 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2">
            <Palette className="w-6 h-6 text-[#D4CA05]" />
            Kreator Logo Projektu SimLE
          </h1>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            Zaznaczaj trójkąty na siatce, aby stworzyć dynamiczną kompozycję
            inspirowaną ciągiem Fibonacciego i geometrią, zgodnie z{" "}
            <a
              className="underline"
              href="/SimLE - księga znaku.pdf"
              target="_blank"
            >
              księgą znaku
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-sm font-medium"
              title="Wyczyść płótno"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Wyczyść</span>
            </button>
            <button
              onClick={copyShareLink}
              className="flex items-center gap-2 px-3 py-2 bg-[#D4CA05]/20 hover:bg-[#D4CA05]/30 text-[#D4CA05] border border-[#D4CA05]/50 rounded-md transition-colors text-sm font-medium"
              title="Skopiuj link do udostępnienia"
            >
              <Link className="w-4 h-4" />
              <span className="hidden md:inline">Udostępnij</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
