import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, Trash2, Eraser, Palette, MousePointer2, Plus } from 'lucide-react';

const SimLELogoCreator = () => {
  const [selectedColor, setSelectedColor] = useState('#F58220'); // Domyślny pomarańczowy
  
  // Wczytywanie stanu rysunku z pamięci przeglądarki (localStorage)
  const [paintedTriangles, setPaintedTriangles] = useState(() => {
    try {
      const saved = localStorage.getItem('simle_painted_triangles');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isDrawing, setIsDrawing] = useState(false);
  
  // Wczytywanie własnych kolorów z pamięci przeglądarki (localStorage)
  const [customColors, setCustomColors] = useState(() => {
    try {
      const saved = localStorage.getItem('simle_custom_colors');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [tempColor, setTempColor] = useState('#000000');

  // Efekt zapisujący stan rysunku za każdym razem, gdy się zmieni
  useEffect(() => {
    localStorage.setItem('simle_painted_triangles', JSON.stringify(paintedTriangles));
  }, [paintedTriangles]);

  // Efekt zapisujący własne kolory za każdym razem, gdy dodasz nowy
  useEffect(() => {
    localStorage.setItem('simle_custom_colors', JSON.stringify(customColors));
  }, [customColors]);

  // Paleta kolorów bazująca na standardowych kolorach identyfikacji studenckiej / tech
  const colors = [
    { name: 'Pomarańczowy (Główny)', value: '#F58220' },
    { name: 'Granatowy (Główny)', value: '#163A5F' },
    { name: 'Ciemny Granat', value: '#0B1D30' },
    { name: 'Jasny Niebieski', value: '#4BB7E6' },
    { name: 'Żółty', value: '#F7941D' },
    { name: 'Jasny Szary', value: '#E6E7E8' },
    { name: 'Ciemny Szary', value: '#58595B' },
    { name: 'Biały', value: '#FFFFFF' }
  ];

  // Konfiguracja siatki trójkątów (szablonu)
  const gridConfig = useMemo(() => {
    const side = 40; // Długość boku trójkąta
    const h = side * Math.sqrt(3) / 2; // Wysokość trójkąta
    const rows = 18; // Liczba wierszy
    const cols = 32; // Liczba kolumn (pół-szerokości boku)
    
    const width = (cols * side) / 2 + side / 2;
    const height = rows * h;

    const triangles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = c * side / 2;
        let y = r * h;

        // Jeśli (r + c) jest parzyste -> trójkąt skierowany w górę
        if ((r + c) % 2 === 0) {
          triangles.push({
            id: `${r}-${c}`,
            points: `${x},${y + h} ${x + side / 2},${y} ${x + side},${y + h}`
          });
        } else {
          // Jeśli nieparzyste -> trójkąt skierowany w dół
          triangles.push({
            id: `${r}-${c}`,
            points: `${x},${y} ${x + side / 2},${y + h} ${x + side},${y}`
          });
        }
      }
    }

    return { triangles, width, height };
  }, []);

  // Globalny listener do obsługi puszczania przycisku myszy (zakończenie malowania)
  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleTriangleInteraction = useCallback((id) => {
    setPaintedTriangles(prev => {
      // Jeśli wybrany kolor to "gumka" (null), usuwamy wpis
      if (selectedColor === null) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      // W przeciwnym razie aktualizujemy kolor
      return { ...prev, [id]: selectedColor };
    });
  }, [selectedColor]);

  const clearCanvas = () => {
    if (window.confirm('Czy na pewno chcesz wyczyścić całe pole robocze?')) {
      setPaintedTriangles({});
    }
  };

  const downloadSvg = () => {
    const svgElement = document.getElementById('logo-canvas');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Dodanie przestrzeni nazw jeśli ich brakuje
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "simle-logo-wektor.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Nagłówek */}
      <header className="bg-[#163A5F] text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2">
              <Palette className="w-6 h-6 text-[#F58220]" />
              Kreator Logo / Sygnetu
            </h1>
            <p className="text-gray-300 text-sm mt-1 max-w-xl">
              Zaznaczaj trójkąty na siatce, aby stworzyć dynamiczną kompozycję inspirowaną ciągiem Fibonacciego i geometrią, zgodnie z księgą znaku.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Wyczyść
            </button>
            <button
              onClick={downloadSvg}
              className="flex items-center gap-2 px-4 py-2 bg-[#F58220] hover:bg-[#d97018] rounded-md transition-colors text-sm font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              Pobierz SVG
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Pasek Narzędzi */}
        <aside className="w-full lg:w-64 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Narzędzia</h2>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
              <MousePointer2 className="w-4 h-4 text-gray-500" />
              Akcja
            </h3>
            <button
              onClick={() => setSelectedColor(null)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all ${
                selectedColor === null 
                  ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Eraser className="w-4 h-4" />
              Gumka
            </button>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-500" />
              Paleta kolorów
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`group relative h-12 rounded-lg border-2 transition-all ${
                    selectedColor === color.value 
                      ? 'border-gray-900 scale-105 shadow-md' 
                      : 'border-transparent hover:scale-105 shadow-sm'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {/* Subtelny obrys dla białego koloru */}
                  {color.value === '#FFFFFF' && (
                    <div className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none" />
                  )}
                </button>
              ))}
              
              {/* Wyrenderowane własne kolory */}
              {customColors.map((color, index) => (
                <button
                  key={`custom-${index}`}
                  onClick={() => setSelectedColor(color)}
                  className={`group relative h-12 rounded-lg border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-gray-900 scale-105 shadow-md' 
                      : 'border-transparent hover:scale-105 shadow-sm'
                  }`}
                  style={{ backgroundColor: color }}
                  title="Własny kolor"
                />
              ))}
            </div>

            {/* Formularz dodawania własnego koloru (po zatwierdzeniu) */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nowy kolor</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value.toUpperCase())}
                  className="w-10 h-10 p-0.5 border border-gray-200 rounded cursor-pointer bg-white shrink-0"
                  title="Wybierz nowy kolor"
                />
                <button
                  onClick={() => {
                    if (!customColors.includes(tempColor) && !colors.some(c => c.value === tempColor)) {
                      setCustomColors(prev => [...prev, tempColor]);
                    }
                    setSelectedColor(tempColor);
                  }}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Zatwierdź
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
            <p><strong>Wskazówka:</strong> Przytrzymaj lewy przycisk myszy i przeciągnij po siatce, aby szybko zamalować wiele trójkątów na raz.</p>
          </div>
        </aside>

        {/* Obszar Roboczy */}
        <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex items-center justify-center p-4">
          <div className="overflow-auto max-w-full max-h-full">
            <svg
              id="logo-canvas"
              width={gridConfig.width}
              height={gridConfig.height}
              viewBox={`0 0 ${gridConfig.width} ${gridConfig.height}`}
              className="bg-transparent touch-none cursor-crosshair"
              style={{ minWidth: gridConfig.width, minHeight: gridConfig.height }}
              onMouseLeave={() => setIsDrawing(false)}
            >
              {gridConfig.triangles.map((triangle) => {
                const isPainted = paintedTriangles[triangle.id] !== undefined;
                const fillColor = isPainted ? paintedTriangles[triangle.id] : 'transparent';
                // Aby uniknąć brzydkich przerw między trójkątami, nadajemy im lekki stroke w kolorze wypełnienia
                const strokeColor = isPainted ? paintedTriangles[triangle.id] : '#E5E7EB';
                
                return (
                  <polygon
                    key={triangle.id}
                    points={triangle.points}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isPainted ? "1" : "0.5"}
                    className="transition-colors duration-75"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Zapobiega systemowemu przeciąganiu elementu
                      setIsDrawing(true);
                      handleTriangleInteraction(triangle.id);
                    }}
                    onMouseEnter={() => {
                      if (isDrawing) {
                        handleTriangleInteraction(triangle.id);
                      }
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </section>

      </main>
    </div>
  );
};

export default SimLELogoCreator;