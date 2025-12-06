import { Cell, CellType } from '@/types/simulation';

export const createEmptyGrid = (width: number, height: number): Cell[][] => {
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        type: CellType.EMPTY,
      });
    }
    grid.push(row);
  }
  return grid;
};

export const GRID_WIDTH = 40;
export const GRID_HEIGHT = 30;
export const CELL_SIZE = 20;

