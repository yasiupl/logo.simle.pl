import { useState, useEffect } from "react";

export const useFontLoader = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [font, setFont] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFont = () => {
      if (!isMounted) return;
      // @ts-expect-error opentype is loaded from CDN
      if (window.opentype) {
        // @ts-expect-error opentype is loaded from CDN
        window.opentype.load(
          "/ScienceGothic-Medium.ttf",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // @ts-expect-error opentype is loaded from CDN
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

  return font;
};
