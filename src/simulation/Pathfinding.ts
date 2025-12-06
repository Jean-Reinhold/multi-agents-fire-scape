import { Cell, CellType, Vector2D } from '@/types/simulation';
import { GRID_HEIGHT, GRID_WIDTH } from '@/utils/grid';

export const generateFlowField = (grid: Cell[][]): Vector2D[][] => {
  const field: Vector2D[][] = Array(GRID_HEIGHT).fill(0).map(() => Array(GRID_WIDTH).fill({ x: 0, y: 0 }));
  const distMap: number[][] = Array(GRID_HEIGHT).fill(0).map(() => Array(GRID_WIDTH).fill(Infinity));
  
  const queue: { x: number, y: number }[] = [];

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x].type === CellType.EXIT || grid[y][x].type === CellType.REVOLVING_DOOR) {
        distMap[y][x] = 0;
        queue.push({ x, y });
      }
    }
  }

  const dirs = [
    { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 },
    { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDist = distMap[current.y][current.x];

    for (const d of dirs) {
      const nx = current.x + d.x;
      const ny = current.y + d.y;

      if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
        if (grid[ny][nx].type === CellType.WALL) continue;

        if (distMap[ny][nx] > currentDist + 1) {
          distMap[ny][nx] = currentDist + 1;
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x].type === CellType.WALL) continue;
      
      let minNeighbor = Infinity;
      let target: Vector2D = { x: 0, y: 0 };

      for (const d of dirs) {
        const nx = x + d.x;
        const ny = y + d.y;
        if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
          if (distMap[ny][nx] < minNeighbor) {
            minNeighbor = distMap[ny][nx];
            target = { x: d.x, y: d.y };
          }
        }
      }
      
      const mag = Math.sqrt(target.x * target.x + target.y * target.y);
      if (mag > 0) {
        field[y][x] = { x: target.x / mag, y: target.y / mag };
      }
    }
  }

  return field;
};

