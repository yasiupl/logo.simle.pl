import React from "react";
import { useLogoState } from "./hooks/useLogoState";
import { useFontLoader } from "./hooks/useFontLoader";
import { useGridConfig } from "./hooks/useGridConfig";
import { Header } from "./components/Header";
import { colors } from "./constants/logoConstants";
import { Sidebar } from "./components/Sidebar";
import { Workspace } from "./components/Workspace";
import { Preview } from "./components/Preview";
import { DownloadSection } from "./components/DownloadSection";
import { Toast } from "./components/Toast";

const SimLELogoCreator: React.FC = () => {
  const {
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
  } = useLogoState();

  const font = useFontLoader();
  const gridConfig = useGridConfig();

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

  const addCustomColor = (color: string) => {
    const isBaseColor = colors.some((c) => c.value === color);
    if (!customColors.includes(color) && !isBaseColor) {
      setCustomColors((prev) => [...prev, color]);
    }
  };

  const hasDrawn = Object.keys(paintedTriangles).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Science+Gothic:wght@500;700&display=swap');`,
        }}
      />

      <Header clearCanvas={clearCanvas} copyShareLink={copyShareLink} />

      <Toast message={toastMessage} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-6 h-fit">
          <Sidebar
            projectName={projectName}
            setProjectName={setProjectName}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            customColors={customColors}
            tempColor={tempColor}
            setTempColor={setTempColor}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            isDeleteMode={isDeleteMode}
            setIsDeleteMode={setIsDeleteMode}
            removeCustomColor={removeCustomColor}
            addCustomColor={addCustomColor}
          />

          <Workspace
            gridConfig={gridConfig}
            paintedTriangles={paintedTriangles}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            handleTriangleInteraction={handleTriangleInteraction}
          />
        </div>

        <Preview
          gridConfig={gridConfig}
          paintedTriangles={paintedTriangles}
          projectName={projectName}
          primaryColor={primaryColor}
          font={font}
        />

        <DownloadSection
          projectName={projectName}
          setToastMessage={setToastMessage}
          hasDrawn={hasDrawn}
        />

        <div>
          <p>
            Made with ❤️ by{" "}
            <a href="https://yasiu.pl" target="_blank" rel="noreferrer">
              yasiu.pl
            </a>
            .{" "}
            <a
              href="https://github.com/yasiupl/logo.simle.pl"
              target="_blank"
              rel="noreferrer"
            >
              Kod źródłowy na GitHubie
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
};

export default SimLELogoCreator;
