import React from "react";
import type { GridConfig } from "../types";

interface WorkspaceProps {
  gridConfig: GridConfig;
  paintedTriangles: Record<string, string>;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  handleTriangleInteraction: (id: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  gridConfig,
  paintedTriangles,
  isDrawing,
  setIsDrawing,
  handleTriangleInteraction,
}) => {
  return (
    <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-center p-4 h-fit">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
        Obszar roboczy
      </h2>
      <p className="mb-6">Narysuj sygnet twojego projektu poniżej.</p>
      <div className="overflow-auto max-w-full max-h-full flex justify-center">
        <svg
          id="logo-canvas"
          width={gridConfig.width}
          height={gridConfig.height}
          viewBox={`0 0 ${gridConfig.width} ${gridConfig.height}`}
          className="bg-transparent touch-none cursor-crosshair mx-auto"
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
  );
};
