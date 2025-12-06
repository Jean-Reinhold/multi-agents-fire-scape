export type Vector2D = {
  x: number;
  y: number;
};

export enum AgentState {
  ALIVE = 'ALIVE',
  SAFE = 'SAFE',
  DEAD = 'DEAD',
  JAMMED = 'JAMMED',
}

export enum CellType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  EXIT = 'EXIT',
  REVOLVING_DOOR = 'REVOLVING_DOOR',
}

export type Cell = {
  x: number;
  y: number;
  type: CellType;
  isBlocked?: boolean;
  hasFire?: boolean;
};

export interface Agent {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  speed: number;
  panicLevel: number;
  state: AgentState;
}

export interface SimulationConfig {
  width: number;
  height: number;
  cellSize: number;
  scenario: 'REAL' | 'INTERMEDIATE' | 'IDEAL';
  totalAgents: number;
  panicThreshold: number;
  doorJamSensitivity: number;
  timeScale: number;
  fireSpreadSpeed: number;
}

export interface SimulationStats {
  evacuatedCount: number;
  casualtyCount: number;
  timeElapsed: number;
  jamCount: number;
  aliveCount: number;
  jammedAgentCount: number;
}
