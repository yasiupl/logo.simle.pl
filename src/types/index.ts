export interface Triangle {
  id: string;
  points: string;
}

export interface GridConfig {
  triangles: Triangle[];
  width: number;
  height: number;
}

export interface ColorOption {
  name: string;
  value: string;
}

export interface LogoState {
  triangles: Record<string, string>;
  colors: string[];
  projectName: string;
  primaryColor: string;
}

export type VisualizationType = "sygnet" | "logo";

export interface SimLEPath {
  transform: string;
  d: string;
}
