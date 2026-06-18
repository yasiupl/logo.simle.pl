import { useState, useEffect, useCallback } from "react";
import { custom } from "../constants/logoConstants";
import { getStateFromUrl, updateUrl, encodeState } from "../utils/urlUtils";

export const useLogoState = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>("#D4CA05");
  const [tempColor, setTempColor] = useState("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [paintedTriangles, setPaintedTriangles] = useState<
    Record<string, string>
  >(() => {
    const fromUrl = getStateFromUrl();
    if (fromUrl?.triangles) return fromUrl.triangles;
    const saved = localStorage.getItem("simle_painted_triangles");
    return saved ? JSON.parse(saved) : {};
  });

  const [isDrawing, setIsDrawing] = useState(false);

  const [customColors, setCustomColors] = useState<string[]>(() => {
    const fromUrl = getStateFromUrl();
    if (fromUrl?.colors) return fromUrl.colors;
    const saved = localStorage.getItem("simle_custom_colors");
    if (saved) {
      const parsed = JSON.parse(saved);
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
  });

  const [projectName, setProjectName] = useState(() => {
    const fromUrl = getStateFromUrl();
    if (fromUrl?.projectName) return fromUrl.projectName;
    const saved = localStorage.getItem("simle_project_name");
    return saved ? saved : "Projekt";
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    const fromUrl = getStateFromUrl();
    if (fromUrl?.primaryColor) return fromUrl.primaryColor;
    const saved = localStorage.getItem("simle_primary_color");
    return saved ? saved : "#D4CA05";
  });

  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "simle_painted_triangles",
      JSON.stringify(paintedTriangles),
    );
    localStorage.setItem("simle_custom_colors", JSON.stringify(customColors));
    localStorage.setItem("simle_project_name", projectName);
    localStorage.setItem("simle_primary_color", primaryColor);

    const encoded = encodeState({
      triangles: paintedTriangles,
      colors: customColors,
      projectName,
      primaryColor,
    });
    updateUrl(encoded);
  }, [paintedTriangles, customColors, projectName, primaryColor]);

  const removeCustomColor = (colorToRemove: string) => {
    setCustomColors((prev) => prev.filter((c) => c !== colorToRemove));
    if (selectedColor === colorToRemove) setSelectedColor("#D4CA05");
  };

  const clearCanvas = () => {
    setPaintedTriangles({});
  };

  const handleTriangleInteraction = useCallback(
    (id: string) => {
      setPaintedTriangles((prev) => {
        if (selectedColor === null) {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        }
        return { ...prev, [id]: selectedColor };
      });
    },
    [selectedColor],
  );

  return {
    selectedColor,
    setSelectedColor,
    tempColor,
    setTempColor,
    showPicker,
    setShowPicker,
    isDeleteMode,
    setIsDeleteMode,
    toastMessage,
    setToastMessage,
    paintedTriangles,
    setPaintedTriangles,
    isDrawing,
    setIsDrawing,
    customColors,
    setCustomColors,
    projectName,
    setProjectName,
    primaryColor,
    setPrimaryColor,
    removeCustomColor,
    clearCanvas,
    handleTriangleInteraction,
  };
};
