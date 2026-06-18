import React, { useRef, useEffect } from "react";
import { Type, MousePointer2, Eraser, Palette, Star, Plus } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { colors as simleColors } from "../constants/logoConstants";

interface SidebarProps {
  projectName: string;
  setProjectName: (name: string) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  customColors: string[];
  tempColor: string;
  setTempColor: (color: string) => void;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  isDeleteMode: boolean;
  setIsDeleteMode: (mode: boolean) => void;
  removeCustomColor: (color: string) => void;
  addCustomColor: (color: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projectName,
  setProjectName,
  selectedColor,
  setSelectedColor,
  primaryColor,
  setPrimaryColor,
  customColors,
  tempColor,
  setTempColor,
  showPicker,
  setShowPicker,
  isDeleteMode,
  setIsDeleteMode,
  removeCustomColor,
  addCustomColor,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker, setShowPicker]);

  return (
    <aside className="w-full lg:w-64 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit shrink-0">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        Narzędzia
      </h2>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
          <Type className="w-4 h-4 text-[#062D34]" />
          Nazwa projektu
        </h3>
        <p className="mb-3">Tradycyjnie zaczyna się na "S".</p>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Nazwa projektu"
          className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:border-[#D4CA05] transition-colors w-full"
          title="Nazwa projektu"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
          <MousePointer2 className="w-4 h-4 text-[#062D34]" />
          Akcja
        </h3>
        <button
          onClick={() => setSelectedColor(null)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all ${
            selectedColor === null
              ? "bg-[#062D34]/5 border-[#062D34]/30 text-[#062D34] shadow-sm font-medium"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Eraser className="w-4 h-4" />
          Gumka
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#062D34]" />
          Paleta kolorów SimLE
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {simleColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              onDoubleClick={() => setPrimaryColor(color.value)}
              className={`group relative h-12 rounded-lg border-2 transition-all flex items-center justify-center ${
                selectedColor === color.value
                  ? "border-gray-900 scale-105 shadow-md"
                  : "border-transparent hover:scale-105 shadow-sm"
              }`}
              style={{ backgroundColor: color.value }}
              title={`${color.name} (Kliknij dwukrotnie, aby ustawić jako przewodni)`}
            >
              {primaryColor === color.value && (
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />
              )}
              {color.value === "#FFFFFF" && (
                <div className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#062D34]" />
          Paleta kolorów projektu
        </h3>

        <div className="mb-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Nowy kolor
          </h4>
          <div ref={pickerRef} className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-10 h-10 rounded border border-gray-200 shadow-sm shrink-0 transition-transform hover:scale-105"
                style={{ backgroundColor: tempColor }}
              />
              <input
                type="text"
                value={tempColor}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setTempColor(val.startsWith("#") ? val : `#${val}`);
                }}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#D4CA05]"
                placeholder="#000000"
              />
            </div>

            <button
              onClick={() => {
                addCustomColor(tempColor);
                setSelectedColor(tempColor);
                setShowPicker(false);
              }}
              className="w-full bg-[#062D34] hover:bg-black text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Dodaj kolor do palety
            </button>

            {showPicker && (
              <div className="absolute top-24 left-0 z-50 p-3 bg-white rounded-xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                <HexColorPicker
                  color={tempColor}
                  onChange={setTempColor}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {customColors.map((color, index) => (
            <button
              key={`custom-${index}`}
              onClick={() => {
                if (isDeleteMode) {
                  removeCustomColor(color);
                } else {
                  setSelectedColor(color);
                }
              }}
              onDoubleClick={() => setPrimaryColor(color)}
              className={`relative h-12 rounded-lg border-2 transition-all flex items-center justify-center
                ${isDeleteMode ? "ring-2 ring-red-500" : ""}
                ${selectedColor === color ? "border-gray-900 scale-105 shadow-md" : "border-transparent"}`}
              style={{ backgroundColor: color }}
              title="Własny kolor (Kliknij dwukrotnie, aby ustawić jako przewodni)"
            >
              {primaryColor === color && (
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />
              )}
              {isDeleteMode && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ×
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          className={`mt-4 w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm text-sm font-medium
            ${isDeleteMode ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
        >
          {isDeleteMode ? "Zakończ usuwanie" : "Usuń kolory"}
        </button>
      </div>
    </aside>
  );
};
