import type { Triangle } from "../types";

export const pt = (px: number, py: number) =>
  `${px.toFixed(3)},${py.toFixed(3)}`;

export const generateMergedPaths = (
  paintedShapes: Triangle[],
  paintedTriangles: Record<string, string>,
): { color: string; pathData: string }[] => {
  const colorGroups: Record<string, Triangle[]> = {};
  paintedShapes.forEach((triangle) => {
    const color = paintedTriangles[triangle.id];
    if (!colorGroups[color]) colorGroups[color] = [];
    colorGroups[color].push(triangle);
  });

  const mergedPaths: { color: string; pathData: string }[] = [];

  for (const [color, triangles] of Object.entries(colorGroups)) {
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
          edgeCounts[reverseKey]--;
        } else {
          edgeCounts[key] = (edgeCounts[key] || 0) + 1;
          edgeData[key] = { from, to };
        }
      }
    });

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

    mergedPaths.push({ color, pathData: colorPaths.trim() });
  }

  return mergedPaths;
};

export const calculateBoundingBox = (shapes: Triangle[]) => {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  shapes.forEach((triangle) => {
    triangle.points.split(" ").forEach((pt) => {
      const [x, y] = pt.split(",").map(Number);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
  });

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
};
