import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Trash2,
  Eraser,
  Palette,
  Type,
  MousePointer2,
  Plus,
  Link,
  Eye,
  Star,
  Hexagon,
  Component,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";

// Szary napis SimLE
const simleTextPaths = [
  {
    transform: "translate(417.032,309.6913)",
    d: "M 0,0 H -30.989 V -8.886 H 3.845 v -23.731 h -45.342 l 3.846,6.662 h 34.835 v 10.407 H -37.651 V 6.661 H 3.845 Z",
  },
  { transform: "translate(438.8967,308.9808)", d: "M 0,0 -3.846,0.001 Z" },
  {
    transform: "translate(441.7119,308.981)",
    d: "m 0,0 -6.661,0.001 v -28.472 -4.961 L 0,-21.894 -3.797,-28.471 0,-21.894 Z",
  },
  {
    transform: "translate(518.389,277.0819)",
    d: "M 0,0 V 39.271 H 6.661 V 6.661 H 30.429 L 26.583,0 Z",
  },
  {
    transform: "translate(559.1455,277.0819)",
    d: "M 0,0 V 39.271 H 33.264 L 29.417,32.609 H 6.661 V 23.723 H 22.188 L 18.342,17.062 H 6.661 V 6.661 H 33.264 L 29.407,0 Z",
  },
  { transform: "translate(504.2158,287.0942)", d: "M 0,0 -3.797,-6.577" },
  { transform: "translate(483.3811,287.0942)", d: "M 0,0 -3.797,-6.577" },
  {
    transform: "translate(455.8852,308.9881)",
    d: "m 0,0 v -33.432 l 6.661,11.538 v 15.232 h 14.174 v -26.77 l 6.661,11.538 v 15.232 h 14.173 v -26.77 l 6.662,11.538 V 0 Z",
  },
  { transform: "translate(462.5465,287.0942)", d: "M 0,0 -3.797,-6.577" },
];

// Paleta barw SimLE
const colors = [
  { name: "Oliwkowy", value: "#D4CA05" },
  { name: "Ciemnozielony", value: "#3B6329" },
  { name: "Morski", value: "#2B7A87" },
  { name: "Ciemny Morski", value: "#062D34" },
  { name: "Szary (Podany)", value: "#D4D3D3" },
  { name: "Ciemny Szary", value: "#58595B" },
  { name: "Czarny", value: "#000000" },
  { name: "Biały", value: "#FFFFFF" },
];

// Paleta barw Projektu (domyślna)
const custom = [
  "#FF5722", // International Orange
];

const SimLELogoCreator = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>("#D4CA05");
  const [tempColor, setTempColor] = useState("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [font, setFont] = useState<any>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Wczytywanie stanu rysunku z URL (Base64) lub w ostateczności z pamięci przeglądarki
  const [paintedTriangles, setPaintedTriangles] = useState<
    Record<string, string>
  >(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dataParam = urlParams.get("d");
      if (dataParam) {
        const parsed = JSON.parse(atob(dataParam));
        if (parsed.triangles) return parsed.triangles;
      }
      const saved = localStorage.getItem("simle_painted_triangles");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isDrawing, setIsDrawing] = useState(false);

  // Wczytywanie własnych kolorów z URL (Base64) lub w ostateczności z pamięci przeglądarki
  const [customColors, setCustomColors] = useState<string[]>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dataParam = urlParams.get("d");
      if (dataParam) {
        const parsed = JSON.parse(atob(dataParam));
        if (
          parsed.colors &&
          (parsed.colors.length === 0 || typeof parsed.colors[0] === "string")
        ) {
          return parsed.colors;
        }
      }
      const saved = localStorage.getItem("simle_custom_colors");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Sprawdzenie, czy w pamięci nie zapisał się stary format z obiektami (np. po poprzedniej wersji)
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          typeof parsed[0] !== "string"
        ) {
          return custom;
        }
        return parsed;
      }
      return custom;
    } catch (e) {
      return custom;
    }
  });

  const removeCustomColor = (colorToRemove: string) => {
    setCustomColors((prev) => prev.filter((c) => c !== colorToRemove));
    // Jeśli usuwamy aktualnie wybrany kolor, zresetuj go
    if (selectedColor === colorToRemove) setSelectedColor("#D4CA05");
  };

  // Wczytywanie nazwy projektu
  const [projectName, setProjectName] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dataParam = urlParams.get("d");
      if (dataParam) {
        const parsed = JSON.parse(atob(dataParam));
        if (parsed.projectName) return parsed.projectName;
      }
      const saved = localStorage.getItem("simle_project_name");
      return saved ? saved : "Projekt";
    } catch (e) {
      return "Projekt";
    }
  });

  // Wczytywanie koloru przewodniego (do nazwy w wizualizacji)
  const [primaryColor, setPrimaryColor] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const dataParam = urlParams.get("d");
      if (dataParam) {
        const parsed = JSON.parse(atob(dataParam));
        if (parsed.primaryColor) return parsed.primaryColor;
      }
      const saved = localStorage.getItem("simle_primary_color");
      return saved ? saved : "#D4CA05";
    } catch (e) {
      return "#D4CA05";
    }
  });

  // Obsługa kliknięcia poza pickerem koloru
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
  }, [showPicker]);

  useEffect(() => {
    let isMounted = true;

    const loadFont = () => {
      if (!isMounted) return;
      // @ts-ignore
      if (window.opentype) {
        // @ts-ignore
        window.opentype.load(
          "/ScienceGothic-Medium.ttf",
          (err: any, loadedFont: any) => {
            if (err) {
              console.error("Nie udało się wczytać czcionki wektorowej.", err);
            } else if (loadedFont && isMounted) {
              setFont(loadedFont);
            }
          },
        );
      }
    };

    // @ts-ignore
    if (window.opentype) {
      loadFont();
    } else {
      const scriptUrl =
        "https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js";
      let script = document.querySelector(
        `script[src="${scriptUrl}"]`,
      ) as HTMLScriptElement;

      if (!script) {
        script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        document.head.appendChild(script);
      }

      // Dodajemy Event Listener - dzięki temu zapobiegamy problemom z trybem StrictMode w React 18
      script.addEventListener("load", loadFont);

      return () => {
        isMounted = false;
        script.removeEventListener("load", loadFont);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Efekt zapisujący stan w localStorage oraz kodujący go do Base64 w pasku adresu
  useEffect(() => {
    localStorage.setItem(
      "simle_painted_triangles",
      JSON.stringify(paintedTriangles),
    );
    localStorage.setItem("simle_custom_colors", JSON.stringify(customColors));
    localStorage.setItem("simle_project_name", projectName);
    localStorage.setItem("simle_primary_color", primaryColor);

    try {
      const stateToEncode = {
        triangles: paintedTriangles,
        colors: customColors,
        projectName,
        primaryColor,
      };
      const encoded = btoa(JSON.stringify(stateToEncode));
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?d=${encoded}`;
      // Zmieniamy adres URL bez przeładowywania strony
      window.history.replaceState({ path: newUrl }, "", newUrl);
    } catch (e) {
      console.error("Błąd kodowania adresu URL", e);
    }
  }, [paintedTriangles, customColors, projectName, primaryColor]);

  // Konfiguracja siatki trójkątów (szablonu)
  const gridConfig = useMemo(() => {
    const side = 40; // Długość boku trójkąta
    const h = (side * Math.sqrt(3)) / 2; // Wysokość trójkąta
    const rows = 18; // Liczba wierszy
    const cols = 32; // Liczba kolumn (pół-szerokości boku)

    const width = (cols * side) / 2 + side / 2;
    const height = rows * h;

    const triangles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = (c * side) / 2;
        let y = r * h;

        // Funkcja formatująca punkty do stałej dokładności - niezbędne dla
        // perfekcyjnego łączenia wierzchołków i usuwania problemów z precyzją JS
        const pt = (px: number, py: number) =>
          `${px.toFixed(3)},${py.toFixed(3)}`;

        // Jeśli (r + c) jest parzyste -> trójkąt skierowany w górę
        if ((r + c) % 2 === 0) {
          triangles.push({
            id: `${r}-${c}`,
            // Zapis zgodny z ruchem wskazówek zegara (CW)
            points: `${pt(x, y + h)} ${pt(x + side / 2, y)} ${pt(x + side, y + h)}`,
          });
        } else {
          // Jeśli nieparzyste -> trójkąt skierowany w dół
          triangles.push({
            id: `${r}-${c}`,
            // Modyfikacja zapisu, aby również był zgodny z ruchem wskazówek zegara (CW)
            // Ujednolicony wektor krawędzi pozwala algorytmowi łączyć ścieżki SVG
            points: `${pt(x, y)} ${pt(x + side, y)} ${pt(x + side / 2, y + h)}`,
          });
        }
      }
    }

    return { triangles, width, height };
  }, []);

  // Globalny listener do obsługi puszczania przycisku myszy (zakończenie malowania)
  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleTriangleInteraction = useCallback(
    (id: string) => {
      setPaintedTriangles((prev) => {
        // Jeśli wybrany kolor to "gumka" (null), usuwamy wpis
        if (selectedColor === null) {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        }
        // W przeciwnym razie aktualizujemy kolor
        return { ...prev, [id]: selectedColor };
      });
    },
    [selectedColor],
  );

  const clearCanvas = () => {
    setPaintedTriangles({});
  };

  const copyShareLink = () => {
    const el = document.createElement("textarea");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    setToastMessage("Link z projektem skopiowany do schowka!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const downloadFileName = (type: "sygnet" | "logo") => {
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const safeProjectName =
      projectName.trim().replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ_-]/g, "_") ||
      "Projekt";
    const typeName = type === "logo" ? "Logo" : "Sygnet";
    return `SimLE_${typeName}_${safeProjectName}_${dateStr}`;
  };

  const downloadSVG = (type: "sygnet" | "logo") => {
    // 1. Sprawdzamy czy w ogóle mamy co pobrać ZANIM cokolwiek zaczniemy budować
    const paintedShapes = gridConfig.triangles.filter(
      (t) => paintedTriangles[t.id] !== undefined,
    );
    if (paintedShapes.length === 0) {
      setToastMessage("Brak elementów do eksportu!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    requestAnimationFrame(() => {
      const container = document.getElementById(`${type}-visualization`);
      const svgElement = container?.querySelector("svg");

      if (!svgElement) {
        console.error(`Nie znaleziono wygenerowanego pliku SVG dla: ${type}`);
        setToastMessage(`Wystąpił błąd podczas generowania pliku.`);
        setTimeout(() => setToastMessage(""), 4000);
        return;
      }

      const svgContent = new XMLSerializer().serializeToString(svgElement);

      const svgBlob = new Blob([svgContent.trim()], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `${downloadFileName(type)}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setToastMessage(`Pobrano plik: ${downloadFileName(type)}.svg`);
      setTimeout(() => setToastMessage(""), 4000);
    });
  };

  const downloadPNG = (type: "sygnet" | "logo") => {
    const paintedShapes = gridConfig.triangles.filter(
      (t) => paintedTriangles[t.id] !== undefined,
    );
    if (paintedShapes.length === 0) {
      setToastMessage("Brak elementów do eksportu!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    const container = document.getElementById(`${type}-visualization`);
    const svgElement = container?.querySelector("svg");

    if (!svgElement) return;

    // 1. Serializacja SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const viewBox = svgElement.getAttribute("viewBox")?.split(" ") || [
      "0",
      "0",
      "1000",
      "500",
    ];
    const originalWidth = parseFloat(viewBox[2]);
    const originalHeight = parseFloat(viewBox[3]);

    // Minimalna wysokość 1080px
    const minHeight = 1080;
    const scale = minHeight / originalHeight;
    const width = originalWidth * scale;
    const height = minHeight;

    // 2. Utworzenie obiektu Blob i URL dla obrazu
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    // 3. Rysowanie na canvasie
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      // 4. Pobieranie pliku
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${downloadFileName(type)}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setToastMessage(`Pobrano plik: ${downloadFileName(type)}.png`);
      setTimeout(() => setToastMessage(""), 4000);

      // Sprzątanie
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const renderSVG = (type: "sygnet" | "logo") => {
    const paintedShapes = gridConfig.triangles.filter(
      (t) => paintedTriangles[t.id] !== undefined,
    );

    // ZWROT BEZ ZMIANY STANU (usunięto alerty, które powodowały pętlę renderowania)
    if (paintedShapes.length === 0) {
      if (type === "logo") {
        return (
          <div className="text-gray-400 flex flex-col items-center gap-2 py-8 w-full justify-center">
            <Eye className="w-8 h-8 opacity-50" />
            <p>Narysuj sygnet, aby zobaczyć wizualizację logo.</p>
          </div>
        );
      }
      return null;
    }

    // Obliczanie obszaru (bounding box) tylko dla pokolorowanych trójkątów
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    paintedShapes.forEach((triangle) => {
      triangle.points.split(" ").forEach((pt) => {
        const [x, y] = pt.split(",").map(Number);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      });
    });

    // --- ŁĄCZENIE TRÓJKĄTÓW W JEDNOLITE ŚCIEŻKI SVG (UNION PATHS) ---
    const colorGroups: Record<string, typeof gridConfig.triangles> = {};
    paintedShapes.forEach((triangle) => {
      const color = paintedTriangles[triangle.id];
      if (!colorGroups[color]) colorGroups[color] = [];
      colorGroups[color].push(triangle);
    });

    // Tworzymy tablicę komponentów JSX zamiast stringa
    const pathComponents: React.ReactElement[] = [];

    for (const [color, triangles] of Object.entries(colorGroups)) {
      // Krok 1: Identyfikacja wszystkich krawędzi (te występujące 2x to wewnętrzne)
      // Używamy prostego obiektu do zliczania wystąpień krawędzi
      const edgeCounts: Record<string, number> = {};
      const edgeData: Record<string, { from: string; to: string }> = {};

      triangles.forEach((t) => {
        const pts = t.points.split(" ");
        for (let i = 0; i < 3; i++) {
          const from = pts[i];
          const to = pts[(i + 1) % 3];
          const key = `${from}|${to}`;
          const reverseKey = `${to}|${from}`;

          if (edgeCounts[reverseKey]) {
            edgeCounts[reverseKey]--; // Krawędź znika (jest wewnętrzna)
          } else {
            edgeCounts[key] = (edgeCounts[key] || 0) + 1;
            edgeData[key] = { from, to };
          }
        }
      });

      // Krok 2: Budowanie ścieżek
      let colorPaths = "";
      const availableEdges = new Map(
        Object.entries(edgeData).filter(([k]) => edgeCounts[k] > 0),
      );

      while (availableEdges.size > 0) {
        const [firstKey, firstEdge] = availableEdges.entries().next().value!;
        availableEdges.delete(firstKey);

        let currentPath = `M ${firstEdge.from.replace(",", " ")} L ${firstEdge.to.replace(",", " ")}`;
        let currentTo = firstEdge.to;
        const startNode = firstEdge.from;

        while (currentTo !== startNode) {
          let found = false;
          for (const [key, edge] of availableEdges.entries()) {
            if (edge.from === currentTo) {
              currentPath += ` L ${edge.to.replace(",", " ")}`;
              currentTo = edge.to;
              availableEdges.delete(key);
              found = true;
              break;
            }
          }
          if (!found) break;
        }
        colorPaths += currentPath + " Z ";
      }

      // Dodajemy gotowy komponent <path> do tablicy
      pathComponents.push(
        <path key={color} d={colorPaths.trim()} fill={color} />,
      );
    }

    const sygnetWidth = maxX - minX;
    const sygnetHeight = maxY - minY;

    // Odstępy bazujące na siatce trójkątów
    const triangleSide = 40;
    const triangleH = (triangleSide * Math.sqrt(3)) / 2;
    const marginX = triangleSide * 2;
    const marginY = triangleH * 2;
    const innerGap = triangleSide * 2; // Odstęp między sygnetem a tekstem

    // Wysokość bloku tekstowego: samo SimLE to ~56px.
    const simleHeight = 56;

    // Zdefiniowanie wizualnej wysokości liter (60% wysokości SimLE) oraz odstępu (30%)
    const visualTextHeight = simleHeight * 0.6;
    const projectSpacing = simleHeight * 0.2;

    // Rekompensata wbudowanego marginesu czcionki (wielkie litery zajmują ok. ~73% całkowitego rozmiaru w tej czcionce)
    const capHeightRatio = 0.73;
    const actualFontSize = visualTextHeight / capHeightRatio;

    // Czysta wysokość całego bloku (bez ukrytych marginesów z dołu czcionki)
    const textBlockHeight = projectName.trim()
      ? simleHeight + projectSpacing + visualTextHeight
      : simleHeight;

    // Obliczamy skale dla loga tekstowego, aby jego wysokość odpowiadała całkowitej wysokości sygnetu
    const textScale = sygnetHeight / textBlockHeight;

    let exactTextWidth = Math.max(
      300,
      projectName.length * (actualFontSize * 1.1),
    );
    let textRender = null;

    if (projectName.trim()) {
      const textToRender = projectName.toUpperCase();

      if (font) {
        let vectorPaths = "";
        let currentX = 0;
        const letterSpacePx = actualFontSize * 0.05;

        try {
          // Pobranie obwiedni pierwszej litery, by usunąć wewnętrzny margines (left side bearing)
          const firstGlyph = font.charToGlyph(textToRender[0]);
          const firstPathBBox = firstGlyph
            .getPath(0, 0, actualFontSize)
            .getBoundingBox();
          currentX = -(firstPathBBox.x1 || 0);

          for (let i = 0; i < textToRender.length; i++) {
            const char = textToRender[i];
            const glyph = font.charToGlyph(char);
            const path = glyph.getPath(
              currentX,
              simleHeight + projectSpacing + visualTextHeight,
              actualFontSize,
            );
            vectorPaths += path.toPathData(3) + " ";
            currentX +=
              glyph.advanceWidth * (actualFontSize / font.unitsPerEm) +
              letterSpacePx;
          }
          exactTextWidth = Math.max(300, currentX - letterSpacePx);

          if (vectorPaths.trim()) {
            textRender = <path d={vectorPaths.trim()} fill={primaryColor} />;
          }
        } catch (err) {
          console.error("Błąd generowania podglądu wektora:", err);
        }
      }

      if (!textRender) {
        textRender = (
          <text
            x={-actualFontSize * 0.04} // Mała korekta dla fallbacku tekstowego
            y={simleHeight + projectSpacing + visualTextHeight}
            fontFamily="'Science Gothic', sans-serif"
            fontSize={actualFontSize}
            fontWeight="500"
            fill={primaryColor}
            style={{ textTransform: "uppercase" }}
            letterSpacing="0.05em"
          >
            {textToRender}
          </text>
        );
      }
    }

    const scaledTextWidth = exactTextWidth * textScale;

    const sygnet = (
      <g transform={`translate(${marginX}, ${marginY})`}>
        <g transform={`translate(${-minX}, ${-minY})`}>{pathComponents}</g>
      </g>
    );

    const logo = (
      <g
        transform={`translate(${marginX + sygnetWidth + innerGap}, ${marginY})`}
      >
        <g transform={`scale(${textScale})`}>
          <g transform="translate(-505.8, -371.9)">
            <g transform="matrix(1.3333333,0,0,-1.3333333,0,793.70667)">
              {simleTextPaths.map((pathObj, idx) => (
                <g key={`simle-path-${idx}`} transform={pathObj.transform}>
                  <path d={pathObj.d} fill="#70706f" fillRule="nonzero" />
                </g>
              ))}
            </g>
          </g>
          {textRender}
        </g>
      </g>
    );

    const sygnetTotalWidth = sygnetWidth + marginX * 2;
    const sygnetTotalHeight = sygnetHeight + marginY * 2;
    const logoTotalWidth =
      marginX + sygnetWidth + innerGap + scaledTextWidth + marginX;
    // Wysokość jest zdeterminowana przez sygnet, ponieważ tekst jest do niego skalowany
    const logoTotalHeight = sygnetHeight + marginY * 2;

    if (type === "logo") {
      return (
        <svg
          viewBox={`0 0 ${logoTotalWidth} ${logoTotalHeight}`}
          className="w-auto max-w-full drop-shadow-sm h-full max-h-32"
        >
          {sygnet}
          {logo}
        </svg>
      );
    } else if (type === "sygnet") {
      return (
        <svg viewBox={`0 0 ${sygnetTotalWidth} ${sygnetTotalHeight}`}>
          {sygnet}
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Ładowanie czcionki Science Gothic z Google Fonts dla wizualizacji */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Science+Gothic:wght@500;700&display=swap');`,
        }}
      />

      {/* Nagłówek */}
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

      {/* Komunikat o skopiowaniu (Toast) */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#062D34] text-[#D4CA05] px-6 py-3 rounded-md shadow-lg border border-[#D4CA05]/20 z-50 flex items-center gap-2 transition-opacity">
          <Link className="w-4 h-4" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Kontener Narzędzi i Obszaru Roboczego */}
        <div className="flex flex-col lg:flex-row gap-6 h-fit">
          {/* Pasek Narzędzi */}
          <aside className="w-full lg:w-64 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit shrink-0">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              Narzędzia
            </h2>
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                <Type className="w-4 h-4 text-[#062D34]" />
                Nazwa projektu
              </h3>
              <p className=" mb-3 ">Tradycyjnie zaczyna się na "S".</p>
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
                {colors.map((color) => (
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
                    {/* Złota gwiazdka dla koloru przewodniego */}
                    {primaryColor === color.value && (
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    )}
                    {/* Subtelny obrys dla białego koloru */}
                    {color.value === "#FFFFFF" && (
                      <div className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              {/* Wyrenderowane własne kolory */}
              <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#062D34]" />
                Paleta kolorów projektu
              </h3>
              {/* Formularz dodawania własnego koloru (po zatwierdzeniu) */}
              <div className="mb-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Nowy kolor
                </h4>
                <div ref={pickerRef} className="relative flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {/* Przycisk podglądu otwierający picker */}
                    <button
                      onClick={() => setShowPicker(!showPicker)}
                      className="w-10 h-10 rounded border border-gray-200 shadow-sm shrink-0 transition-transform hover:scale-105"
                      style={{ backgroundColor: tempColor }}
                    />

                    {/* Pole tekstowe HEX */}
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

                  {/* Przycisk dodawania w nowej linii */}
                  <button
                    onClick={() => {
                      if (
                        !customColors.includes(tempColor) &&
                        !colors.some((c) => c.value === tempColor)
                      ) {
                        setCustomColors((prev) => [...prev, tempColor]);
                      }
                      setSelectedColor(tempColor);
                      setShowPicker(false);
                    }}
                    className="w-full bg-[#062D34] hover:bg-black text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Dodaj kolor do palety
                  </button>

                  {/* Pop-up z pickerem */}
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
                    {/* Złota gwiazdka dla koloru przewodniego (własnego) */}
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

          {/* Obszar Roboczy */}
          <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-center p-4 h-fit">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              Obszar roboczy
            </h2>
            <p className="mb-6">Narysuj sygnet twojego projektu poniżej.</p>
            <div className="overflow-auto max-w-full max-h-full justify-center">
              <svg
                id="logo-canvas"
                width={gridConfig.width}
                height={gridConfig.height}
                viewBox={`0 0 ${gridConfig.width} ${gridConfig.height}`}
                className="bg-transparent touch-none cursor-crosshair"
                style={{
                  minWidth: gridConfig.width,
                  minHeight: gridConfig.height,
                }}
                onMouseLeave={() => setIsDrawing(false)}
              >
                {gridConfig.triangles.map((triangle) => {
                  const isPainted = paintedTriangles[triangle.id] !== undefined;
                  const fillColor = isPainted
                    ? paintedTriangles[triangle.id]
                    : "transparent";
                  const strokeColor = isPainted
                    ? paintedTriangles[triangle.id]
                    : "#E5E7EB";
                  return (
                    <polygon
                      key={triangle.id}
                      points={triangle.points}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isPainted ? "1" : "0.5"}
                      className="transition-colors duration-75"
                      onMouseDown={(e) => {
                        e.preventDefault();
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
            <div className="mt-8 p-4 bg-[#D4CA05]/10 rounded-lg border border-[#D4CA05]/30 text-sm text-[#062D34] flex flex-row gap-3">
              <p>
                <strong>Wskazówka 1:</strong> Przytrzymaj lewy przycisk myszy i
                przeciągnij po siatce, aby szybko zamalować wiele trójkątów na
                raz.
              </p>
              <p>
                <strong>Wskazówka 2:</strong> Kliknij dwukrotnie na kolor w
                palecie, aby ustawić go jako kolor przewodni (oznaczony złotą
                gwiazdką). Zmieni to kolor nazwy projektu w wizualizacji.
              </p>
            </div>
          </section>
        </div>

        {/* Sekcja Podglądu z pełnym logo */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#062D34]" />
            Wizualizacja Logo
          </h2>
          <div
            id="logo-visualization"
            className="w-full flex-1 min-h-[160px] bg-[#f8fafc] border border-gray-100 rounded-lg flex items-center justify-center p-8 overflow-x-auto"
          >
            {renderSVG("logo")}
          </div>
          <div id="sygnet-visualization" className="hidden">
            {renderSVG("sygnet")}
          </div>
        </section>

        {/* Przyciski pobierania SVG*/}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2 mb-8">
          <button
            onClick={() => downloadSVG("sygnet")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#062D34] text-[#062D34] rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            <Hexagon className="w-5 h-5" /> Pobierz Sygnet (SVG)
          </button>
          <button
            onClick={() => downloadPNG("sygnet")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#062D34] text-[#062D34] rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            <Hexagon className="w-5 h-5" /> Pobierz Sygnet (PNG)
          </button>
          <button
            onClick={() => downloadSVG("logo")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#062D34] text-white rounded-lg font-semibold hover:bg-black transition shadow-sm"
          >
            <Component className="w-5 h-5" /> Pobierz Pełne Logo (SVG)
          </button>
          <button
            onClick={() => downloadPNG("logo")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#062D34] text-white rounded-lg font-semibold hover:bg-black transition shadow-sm"
          >
            <Component className="w-5 h-5" /> Pobierz Pełne Logo (PNG)
          </button>
        </div>
        <div>
          <p>
            Made with ❤️ by{" "}
            <a href="https://yasiu.pl" target="_blank">
              yasiu.pl
            </a>
            .{" "}
            <a href="https://github.com/yasiupl/logo.simle.pl" target="_blank">
              See Source Code
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
};

export default SimLELogoCreator;
