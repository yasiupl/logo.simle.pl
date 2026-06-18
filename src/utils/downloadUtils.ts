import type { VisualizationType } from "../types";

export const getDownloadFileName = (
  type: VisualizationType,
  projectName: string,
) => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const safeProjectName =
    projectName.trim().replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ_-]/g, "_") ||
    "Projekt";
  const typeName = type === "logo" ? "Logo" : "Sygnet";
  return `SimLE_${typeName}_${safeProjectName}_${dateStr}`;
};

export const downloadSVG = (
  type: VisualizationType,
  projectName: string,
  setToastMessage: (msg: string) => void,
) => {
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
  const fileName = getDownloadFileName(type, projectName);
  downloadLink.href = svgUrl;
  downloadLink.download = `${fileName}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  setToastMessage(`Pobrano plik: ${fileName}.svg`);
  setTimeout(() => setToastMessage(""), 4000);
};

export const downloadPNG = (
  type: VisualizationType,
  projectName: string,
  setToastMessage: (msg: string) => void,
) => {
  const container = document.getElementById(`${type}-visualization`);
  const svgElement = container?.querySelector("svg");

  if (!svgElement) return;

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

  const minHeight = 1080;
  const scale = minHeight / originalHeight;
  const width = originalWidth * scale;
  const height = minHeight;

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, width, height);

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    const fileName = getDownloadFileName(type, projectName);
    downloadLink.href = pngUrl;
    downloadLink.download = `${fileName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setToastMessage(`Pobrano plik: ${fileName}.png`);
    setTimeout(() => setToastMessage(""), 4000);

    URL.revokeObjectURL(url);
  };
  img.src = url;
};
