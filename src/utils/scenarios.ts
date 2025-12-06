import { Agent, AgentState, Cell, CellType } from '@/types/simulation';
import { createEmptyGrid, GRID_HEIGHT, GRID_WIDTH } from './grid';

export const generateScenarioGrid = (scenario: 'REAL' | 'INTERMEDIATE' | 'IDEAL'): Cell[][] => {
  const grid = createEmptyGrid(GRID_WIDTH, GRID_HEIGHT);

  for (let x = 0; x < GRID_WIDTH; x++) {
    grid[0][x].type = CellType.WALL;
    grid[GRID_HEIGHT - 1][x].type = CellType.WALL;
  }
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y][0].type = CellType.WALL;
    grid[y][GRID_WIDTH - 1].type = CellType.WALL;
  }

  const mainEntranceX = Math.floor(GRID_WIDTH / 2);
  const sideExit1Y = 5;
  const sideExit2Y = GRID_HEIGHT - 5;

  if (scenario === 'REAL') {
    grid[0][mainEntranceX].type = CellType.REVOLVING_DOOR;
    grid[0][mainEntranceX + 1].type = CellType.REVOLVING_DOOR;
  }
  
  else if (scenario === 'INTERMEDIATE') {
    grid[0][mainEntranceX].type = CellType.REVOLVING_DOOR;
    grid[0][mainEntranceX + 1].type = CellType.REVOLVING_DOOR;
    
    grid[sideExit1Y][GRID_WIDTH - 1].type = CellType.EXIT;
    grid[sideExit1Y + 1][GRID_WIDTH - 1].type = CellType.EXIT;
    
    grid[sideExit2Y][0].type = CellType.EXIT;
    grid[sideExit2Y + 1][0].type = CellType.EXIT;
  }
  
  else if (scenario === 'IDEAL') {
    grid[0][mainEntranceX].type = CellType.EXIT;
    grid[0][mainEntranceX + 1].type = CellType.EXIT;
    grid[0][mainEntranceX - 1].type = CellType.EXIT;
    grid[0][mainEntranceX + 2].type = CellType.EXIT; 

    grid[sideExit1Y][GRID_WIDTH - 1].type = CellType.EXIT;
    grid[sideExit1Y + 1][GRID_WIDTH - 1].type = CellType.EXIT;
    
    grid[sideExit2Y][0].type = CellType.EXIT;
    grid[sideExit2Y + 1][0].type = CellType.EXIT;
  }
  
  const pillars = [
      {x: 10, y: 10}, {x: 30, y: 10},
      {x: 10, y: 20}, {x: 30, y: 20}
  ];
  pillars.forEach(p => {
      grid[p.y][p.x].type = CellType.WALL;
      grid[p.y][p.x+1].type = CellType.WALL;
      grid[p.y+1][p.x].type = CellType.WALL;
      grid[p.y+1][p.x+1].type = CellType.WALL;
  });

  return grid;
};

export const generateAgents = (count: number, grid: Cell[][]): Agent[] => {
  const agents: Agent[] = [];
  let attempts = 0;
  
  while (agents.length < count && attempts < count * 10) {
    const x = Math.random() * (GRID_WIDTH - 2) + 1;
    const y = Math.random() * (GRID_HEIGHT - 2) + 1;
    
    const cellX = Math.floor(x);
    const cellY = Math.floor(y);
    
    if (grid[cellY][cellX].type === CellType.EMPTY) {
        agents.push({
            id: Math.random().toString(36).substr(2, 9),
            position: { x, y },
            velocity: { x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1 },
            radius: 0.3,
            speed: 2 + Math.random(),
            panicLevel: 0,
            state: AgentState.ALIVE
        });
    }
    attempts++;
  }
  
  return agents;
};

