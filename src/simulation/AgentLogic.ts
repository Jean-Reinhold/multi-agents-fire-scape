import { Agent, AgentState, Cell, CellType, SimulationConfig, Vector2D } from '@/types/simulation';
import * as Vector from '@/utils/vector';
import { GRID_HEIGHT, GRID_WIDTH } from '@/utils/grid';

export class AgentLogic {
  static VIEW_RADIUS = 5;
  static SEPARATION_RADIUS = 0.8;
  static MAX_FORCE = 0.1;
  static MAX_SPEED = 0.15;
  
  static updateAgent(
    agent: Agent, 
    neighbors: Agent[], 
    grid: Cell[][], 
    flowField: Vector2D[][], 
    config: SimulationConfig,
    dt: number // time scale factor
  ) {
    if (agent.state !== AgentState.ALIVE) return;

    let avgNeighborPanic = 0;
    let neighborCount = 0;
    neighbors.forEach(n => {
      if (Vector.dist(agent.position, n.position) < AgentLogic.VIEW_RADIUS) {
        avgNeighborPanic += n.panicLevel;
        neighborCount++;
      }
    });
    if (neighborCount > 0) {
      avgNeighborPanic /= neighborCount;
    }
    
    if (neighborCount > 0) {
        if (avgNeighborPanic > agent.panicLevel) {
            agent.panicLevel += (avgNeighborPanic - agent.panicLevel) * 0.1 * dt;
        } else if (avgNeighborPanic > 0.3) {
            agent.panicLevel = Math.max(agent.panicLevel, avgNeighborPanic * 0.6);
        }
    }
    
    if (neighborCount === 0 || avgNeighborPanic < 0.15) {
        agent.panicLevel *= 0.995;
    }
    
    agent.panicLevel = Math.max(0, Math.min(1.0, agent.panicLevel));
    
    const forces: Vector2D[] = [];

    const gridPos = { x: Math.floor(agent.position.x), y: Math.floor(agent.position.y) };
    let desired: Vector2D = { x: 0, y: 0 };
    
    if (gridPos.x >= 0 && gridPos.x < GRID_WIDTH && gridPos.y >= 0 && gridPos.y < GRID_HEIGHT) {
        desired = flowField[gridPos.y][gridPos.x];
    }

    if (desired) {
        desired = Vector.mult(desired, agent.speed * (1 + agent.panicLevel));
        const steer = Vector.sub(desired, agent.velocity);
        forces.push(Vector.limit(steer, AgentLogic.MAX_FORCE));
    }

    let separation = { x: 0, y: 0 };
    let count = 0;
    neighbors.forEach(n => {
        const d = Vector.dist(agent.position, n.position);
        if (d > 0 && d < AgentLogic.SEPARATION_RADIUS) {
            let diff = Vector.sub(agent.position, n.position);
            diff = Vector.normalize(diff);
            diff = Vector.div(diff, d);
            separation = Vector.add(separation, diff);
            count++;
        }
    });
    
    if (count > 0) {
        separation = Vector.div(separation, count);
        separation = Vector.normalize(separation);
        separation = Vector.mult(separation, agent.speed);
        separation = Vector.sub(separation, agent.velocity);
        separation = Vector.limit(separation, AgentLogic.MAX_FORCE * 2);
        forces.push(separation);
    }

    if (agent.panicLevel > 0.3) {
        let alignment = { x: 0, y: 0 };
        let alignCount = 0;
        neighbors.forEach(n => {
             const d = Vector.dist(agent.position, n.position);
             if (d > 0 && d < AgentLogic.VIEW_RADIUS) {
                 alignment = Vector.add(alignment, n.velocity);
                 alignCount++;
             }
        });
        if (alignCount > 0) {
            alignment = Vector.div(alignment, alignCount);
            alignment = Vector.normalize(alignment);
            alignment = Vector.mult(alignment, agent.speed);
            const steer = Vector.sub(alignment, agent.velocity);
            forces.push(Vector.mult(Vector.limit(steer, AgentLogic.MAX_FORCE), agent.panicLevel)); 
        }
    }

    forces.forEach(f => {
        agent.velocity = Vector.add(agent.velocity, f);
    });

    agent.velocity = Vector.limit(agent.velocity, AgentLogic.MAX_SPEED * (1 + agent.panicLevel * 0.5));

    const nextPos = Vector.add(agent.position, Vector.mult(agent.velocity, dt));
    if (!AgentLogic.checkCollision(nextPos, grid)) {
        agent.position = nextPos;
    } else {
        agent.velocity = { x: 0, y: 0 };
    }
  }

  static checkCollision(pos: Vector2D, grid: Cell[][]): boolean {
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);
    
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return true;
    
    const cell = grid[y][x];
    if (cell.type === CellType.WALL) return true;
    if (cell.isBlocked) return true;
    
    return false;
  }
}

