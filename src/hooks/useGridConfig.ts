import { useMemo } from "react";
import { GRID_CONFIG } from "../constants/logoConstants";
import { pt } from "../utils/svgUtils";
import type { GridConfig, Triangle } from "../types";

export const useGridConfig = (): GridConfig => {
  return useMemo(() => {
    const side = GRID_CONFIG.SIDE;
    const h = (side * Math.sqrt(3)) / 2;
    const rows = GRID_CONFIG.ROWS;
    const cols = GRID_CONFIG.COLS;

    const width = (cols * side) / 2 + side / 2;
    const height = rows * h;

    const triangles: Triangle[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c * side) / 2;
        const y = r * h;

        if ((r + c) % 2 === 0) {
          triangles.push({
            id: `${r}-${c}`,
            points: `${pt(x, y + h)} ${pt(x + side / 2, y)} ${pt(x + side, y + h)}`,
          });
        } else {
          triangles.push({
            id: `${r}-${c}`,
            points: `${pt(x, y)} ${pt(x + side, y)} ${pt(x + side / 2, y + h)}`,
          });
        }
      }
    }

    return { triangles, width, height };
  }, []);
};
