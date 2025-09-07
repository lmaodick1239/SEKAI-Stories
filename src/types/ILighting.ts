export interface ILighting {
    red: number;
    green: number;
    blue: number;
    brightness: number;
    saturation: number;
}

export type LightingKey = keyof ILighting