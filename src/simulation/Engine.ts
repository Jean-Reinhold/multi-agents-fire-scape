import { Agent, AgentState, Cell, CellType, SimulationConfig, SimulationStats, Vector2D } from '@/types/simulation';
import { AgentLogic } from './AgentLogic';
import { generateFlowField } from './Pathfinding';
import { GRID_HEIGHT, GRID_WIDTH } from '@/utils/grid';
import * as Vector from '@/utils/vector';

export class SimulationEngine {
  agents: Agent[] = [];
  grid: Cell[][] = [];
  flowField: Vector2D[][] = [];
  config: SimulationConfig;
  stats: SimulationStats;
  isRunning: boolean = false;
  
  revolvingDoorForce: number = 0;
  isRevolvingDoorJammed: boolean = false;
  revolvingDoorCells: Cell[] = [];

  fireCells: Cell[] = [];
  nextFireSpreadTime: number = 0;

  constructor(config: SimulationConfig, initialGrid: Cell[][]) {
    this.config = config;
    this.grid = initialGrid;
    this.stats = {
        evacuatedCount: 0,
        casualtyCount: 0,
        timeElapsed: 0,
        jamCount: 0,
        aliveCount: this.agents.length,
        jammedAgentCount: 0,
    };
    this.initGridDerivedState();
  }

  private initGridDerivedState() {
    this.flowField = generateFlowField(this.grid);
    this.revolvingDoorCells = [];
    this.fireCells = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (this.grid[y][x].type === CellType.REVOLVING_DOOR) {
                this.revolvingDoorCells.push(this.grid[y][x]);
            }
            this.grid[y][x].hasFire = false;
        }
    }
  }

  public setGrid(grid: Cell[][]) {
      this.grid = grid;
      this.initGridDerivedState();
  }

  public initAgents(agents: Agent[]) {
    this.agents = agents;
  }

  public update(deltaTime: number) {
    if (!this.isRunning) return;

    const scaledDelta = deltaTime * this.config.timeScale;
    this.stats.timeElapsed += scaledDelta;

    this.updateFire(scaledDelta);
    this.updateAgents(scaledDelta);
    this.checkExits();
    this.updateRevolvingDoor();

    this.stats.aliveCount = this.agents.filter(a => a.state === AgentState.ALIVE).length;
    this.stats.jammedAgentCount = this.agents.filter(a => a.state === AgentState.JAMMED).length;
  }

  private updateFire(dt: number) {
      if (this.stats.timeElapsed > 2 && this.fireCells.length === 0) {
          const startX = 2;
          const startY = GRID_HEIGHT - 3;
          if (this.grid[startY][startX].type !== CellType.WALL) {
              this.grid[startY][startX].hasFire = true;
              this.fireCells.push(this.grid[startY][startX]);
              this.nextFireSpreadTime = this.stats.timeElapsed + 1.0;
              this.flowField = generateFlowField(this.grid);
          }
      }

      if (this.fireCells.length > 0 && this.stats.timeElapsed > this.nextFireSpreadTime) {
          this.nextFireSpreadTime = this.stats.timeElapsed + this.config.fireSpreadSpeed;
          
          const newFireCells: Cell[] = [];
          this.fireCells.forEach(cell => {
              const dirs = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
              dirs.forEach(d => {
                  const nx = cell.x + d.x;
                  const ny = cell.y + d.y;
                  if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                      const neighbor = this.grid[ny][nx];
                      if (!neighbor.hasFire && neighbor.type !== CellType.WALL && neighbor.type !== CellType.EXIT) {
                          if (Math.random() > 0.3) {
                              neighbor.hasFire = true;
                              newFireCells.push(neighbor);
                          }
                      }
                  }
              });
          });
          this.fireCells.push(...newFireCells);
          
          if (newFireCells.length > 0) {
              this.flowField = generateFlowField(this.grid);
          }
      }
  }

  private updateAgents(dt: number) {
    const activeAgents = this.agents.filter(a => a.state === AgentState.ALIVE || a.state === AgentState.JAMMED);

    activeAgents.forEach(agent => {
        const gx = Math.floor(agent.position.x);
        const gy = Math.floor(agent.position.y);
        
        if (gx >= 0 && gx < GRID_WIDTH && gy >= 0 && gy < GRID_HEIGHT) {
            if (this.grid[gy][gx].hasFire) {
                agent.state = AgentState.DEAD;
                this.stats.casualtyCount++;
                return;
            }
        }
        
        if (this.fireCells.length > 0) {
            let minFireDistance = Infinity;
            for (const fireCell of this.fireCells) {
                const dist = Vector.dist(agent.position, { x: fireCell.x + 0.5, y: fireCell.y + 0.5 });
                if (dist < minFireDistance) {
                    minFireDistance = dist;
                }
            }
            
            let panicIncrease = 0;
            if (minFireDistance < 3) {
                panicIncrease = 0.05 * dt;
            } else if (minFireDistance < 8) {
                panicIncrease = 0.025 * dt;
            } else if (minFireDistance < 15) {
                panicIncrease = 0.012 * dt;
            } else {
                panicIncrease = 0.004 * dt;
            }
            
            agent.panicLevel = Math.min(1.0, agent.panicLevel + panicIncrease);
            
            if (this.stats.timeElapsed >= 2 && this.stats.timeElapsed < 3) {
                agent.panicLevel = Math.min(1.0, agent.panicLevel + 0.05 * dt);
            }
        }

        AgentLogic.updateAgent(agent, activeAgents, this.grid, this.flowField, this.config, dt);

        if (this.isRevolvingDoorJammed && agent.state === AgentState.ALIVE) {
             let isNearJammedDoor = false;
             for (const door of this.revolvingDoorCells) {
                 if (Vector.dist(agent.position, { x: door.x + 0.5, y: door.y + 0.5 }) < 3.0) {
                     isNearJammedDoor = true;
                     break;
                 }
             }
             if (isNearJammedDoor && Vector.mag(agent.velocity) < 0.01) {
                 agent.state = AgentState.JAMMED;
             }
        } else if (agent.state === AgentState.JAMMED) {
            if (!this.isRevolvingDoorJammed) {
                agent.state = AgentState.ALIVE;
            } else if (Vector.mag(agent.velocity) > 0.01) {
                agent.state = AgentState.ALIVE;
            }
        }
    });
  }

  private checkExits() {
    this.agents.forEach(agent => {
        if (agent.state !== AgentState.ALIVE && agent.state !== AgentState.JAMMED) return;

        const x = Math.floor(agent.position.x);
        const y = Math.floor(agent.position.y);

        if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
            const cell = this.grid[y][x];
            if (cell.type === CellType.EXIT) {
                agent.state = AgentState.SAFE;
                this.stats.evacuatedCount++;
            } 
            else if (cell.type === CellType.REVOLVING_DOOR) {
                if (!this.isRevolvingDoorJammed) {
                    agent.state = AgentState.SAFE;
                    this.stats.evacuatedCount++;
                }
            }
        }
    });
  }

  private updateRevolvingDoor() {
    if (this.revolvingDoorCells.length === 0) return;

    let sumForces = { x: 0, y: 0 };
    let sumMagnitudes = 0;
    let count = 0;

    this.agents.forEach(agent => {
        if (agent.state !== AgentState.ALIVE && agent.state !== AgentState.JAMMED) return;
        
        for (const door of this.revolvingDoorCells) {
            const d = Vector.dist(agent.position, { x: door.x + 0.5, y: door.y + 0.5 });
            if (d < 2.0) {
                sumForces = Vector.add(sumForces, agent.velocity);
                sumMagnitudes += Vector.mag(agent.velocity);
                count++;
                break;
            }
        }
    });

    if (count === 0) {
        if (this.isRevolvingDoorJammed) {
            this.isRevolvingDoorJammed = false;
            this.revolvingDoorCells.forEach(cell => {
                cell.isBlocked = false;
            });
            this.flowField = generateFlowField(this.grid);
        }
        return;
    }

    const netForce = Vector.mag(sumForces);
    const conflict = sumMagnitudes - netForce; 
    const jamThreshold = this.config.doorJamSensitivity;

    if (this.isRevolvingDoorJammed) {
        if (conflict <= jamThreshold) {
            this.isRevolvingDoorJammed = false;
            this.revolvingDoorCells.forEach(cell => {
                cell.isBlocked = false;
            });
            this.flowField = generateFlowField(this.grid);
        }
    } else {
        if (conflict > jamThreshold) {
            this.isRevolvingDoorJammed = true;
            this.stats.jamCount++;
            this.revolvingDoorCells.forEach(cell => {
                cell.isBlocked = true;
            });
            this.flowField = generateFlowField(this.grid);
        }
    }
  }

  public start() {
    this.isRunning = true;
  }

  public pause() {
    this.isRunning = false;
  }
  
  public reset(initialAgents?: Agent[]) {
    this.isRunning = false;
    this.stats = {
        evacuatedCount: 0,
        casualtyCount: 0,
        timeElapsed: 0,
        jamCount: 0,
        aliveCount: this.agents.length,
        jammedAgentCount: 0,
    };
    this.isRevolvingDoorJammed = false;
    this.revolvingDoorForce = 0;
    this.revolvingDoorCells.forEach(cell => {
        cell.isBlocked = false;
    });
    
    this.fireCells = [];
    this.nextFireSpreadTime = 0;
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            this.grid[y][x].hasFire = false;
        }
    }

    if (initialAgents) {
        this.agents = JSON.parse(JSON.stringify(initialAgents));
    }
    
    this.initGridDerivedState();
  }
}
