import { Vector2D } from '@/types/simulation';

export const add = (v1: Vector2D, v2: Vector2D): Vector2D => ({ x: v1.x + v2.x, y: v1.y + v2.y });
export const sub = (v1: Vector2D, v2: Vector2D): Vector2D => ({ x: v1.x - v2.x, y: v1.y - v2.y });
export const mult = (v: Vector2D, s: number): Vector2D => ({ x: v.x * s, y: v.y * s });
export const div = (v: Vector2D, s: number): Vector2D => (s === 0 ? { x: 0, y: 0 } : { x: v.x / s, y: v.y / s });
export const mag = (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y);
export const normalize = (v: Vector2D): Vector2D => {
  const m = mag(v);
  return m === 0 ? { x: 0, y: 0 } : div(v, m);
};
export const dist = (v1: Vector2D, v2: Vector2D): number => mag(sub(v1, v2));
export const limit = (v: Vector2D, max: number): Vector2D => {
  if (mag(v) > max) {
    return mult(normalize(v), max);
  }
  return v;
};

