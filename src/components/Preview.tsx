import React from "react";
import { Eye } from "lucide-react";
import { simleTextPaths, LOGO_CONFIG } from "../constants/logoConstants";
import { generateMergedPaths, calculateBoundingBox } from "../utils/svgUtils";
import type { GridConfig, VisualizationType } from "../types";

interface PreviewProps {
  gridConfig: GridConfig;
  paintedTriangles: Record<string, string>;
  projectName: string;
  primaryColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  font: any;
}

export const Preview: React.FC<PreviewProps> = ({
  gridConfig,
  paintedTriangles,
  projectName,
  primaryColor,
  font,
}) => {
  const renderSVG = (type: VisualizationType) => {
    const paintedShapes = gridConfig.triangles.filter(
      (t) => paintedTriangles[t.id] !== undefined,
    );

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

    const { minX, minY, width: sygnetWidth, height: sygnetHeight } =
      calculateBoundingBox(paintedShapes);
    const pathComponents = generateMergedPaths(paintedShapes, paintedTriangles);

    const triangleSide = LOGO_CONFIG.TRIANGLE_SIDE;
    const triangleH = (triangleSide * Math.sqrt(3)) / 2;
    const marginX = triangleSide * LOGO_CONFIG.MARGIN_X_MULTIPLIER;
    const marginY = triangleH * LOGO_CONFIG.MARGIN_Y_MULTIPLIER;
    const innerGap = triangleSide * LOGO_CONFIG.INNER_GAP_MULTIPLIER;

    const simleHeight = LOGO_CONFIG.SIMLE_HEIGHT;
    const visualTextHeight = simleHeight * LOGO_CONFIG.VISUAL_TEXT_HEIGHT_RATIO;
    const projectSpacing = simleHeight * LOGO_CONFIG.PROJECT_SPACING_RATIO;
    const capHeightRatio = LOGO_CONFIG.CAP_HEIGHT_RATIO;
    const actualFontSize = visualTextHeight / capHeightRatio;

    const textBlockHeight = projectName.trim()
      ? simleHeight + projectSpacing + visualTextHeight
      : simleHeight;

    const textScale = sygnetHeight / textBlockHeight;

    let exactTextWidth = Math.max(300, projectName.length * (actualFontSize * 1.1));
    let textRender = null;

    if (projectName.trim()) {
      const textToRender = projectName.toUpperCase();

      if (font) {
        let vectorPaths = "";
        const letterSpacePx = actualFontSize * 0.05;

        try {
          const firstGlyph = font.charToGlyph(textToRender[0]);
          const firstPathBBox = firstGlyph
            .getPath(0, 0, actualFontSize)
            .getBoundingBox();
          let currentXPosition = -(firstPathBBox.x1 || 0);

          for (let i = 0; i < textToRender.length; i++) {
            const char = textToRender[i];
            const glyph = font.charToGlyph(char);
            const path = glyph.getPath(
              currentXPosition,
              simleHeight + projectSpacing + visualTextHeight,
              actualFontSize,
            );
            vectorPaths += path.toPathData(3) + " ";
            currentXPosition +=
              glyph.advanceWidth * (actualFontSize / font.unitsPerEm) +
              letterSpacePx;
          }
          exactTextWidth = Math.max(300, currentXPosition - letterSpacePx);

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
            x={-actualFontSize * 0.04}
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
        <g transform={`translate(${-minX}, ${-minY})`}>
          {pathComponents.map(({ color, pathData }) => (
            <path key={color} d={pathData} fill={color} />
          ))}
        </g>
      </g>
    );

    const logo = (
      <g transform={`translate(${marginX + sygnetWidth + innerGap}, ${marginY})`}>
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
    const logoTotalWidth = marginX + sygnetWidth + innerGap + scaledTextWidth + marginX;
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
  );
};
