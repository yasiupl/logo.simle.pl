// Szary napis SimLE
export const simleTextPaths = [
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
export const colors = [
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
export const custom = [
  "#FF5722", // International Orange
];

// Konfiguracja siatki
export const GRID_CONFIG = {
  SIDE: 40,
  ROWS: 18,
  COLS: 32,
};

// Konfiguracja logo i sygnetu
export const LOGO_CONFIG = {
  TRIANGLE_SIDE: 40,
  MARGIN_X_MULTIPLIER: 2,
  MARGIN_Y_MULTIPLIER: 2,
  INNER_GAP_MULTIPLIER: 2,
  SIMLE_HEIGHT: 56,
  VISUAL_TEXT_HEIGHT_RATIO: 0.6,
  PROJECT_SPACING_RATIO: 0.2,
  CAP_HEIGHT_RATIO: 0.73,
};
