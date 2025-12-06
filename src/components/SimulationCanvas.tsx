'use client';

import React, { useEffect, useRef } from 'react';
import { SimulationEngine } from '@/simulation/Engine';
import { Agent, AgentState, Cell, CellType } from '@/types/simulation';
import { GRID_HEIGHT, GRID_WIDTH } from '@/utils/grid';

interface SimulationCanvasProps {
  engine: SimulationEngine;
  width?: number;
  height?: number;
}

export default function SimulationCanvas({ engine, width = 800, height = 600 }: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const CELL_SIZE = width / GRID_WIDTH; 

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      const dt = Math.min(deltaTime / 1000, 0.1); 
      
      engine.update(dt);
      draw();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    engine.grid.forEach(row => {
      row.forEach(cell => {
        drawCell(ctx, cell);
      });
    });

    engine.agents.forEach(agent => {
      drawAgent(ctx, agent);
    });
  };

  const drawCell = (ctx: CanvasRenderingContext2D, cell: Cell) => {
    const x = cell.x * CELL_SIZE;
    const y = cell.y * CELL_SIZE;

    switch (cell.type) {
      case CellType.WALL:
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        break;
      case CellType.EXIT:
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        break;
      case CellType.REVOLVING_DOOR:
        if (cell.isBlocked) {
            ctx.fillStyle = '#ef4444';
        } else {
            ctx.fillStyle = '#eab308';
        }
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, CELL_SIZE/2 - 2, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        break;
      default:
        if (cell.hasFire) {
             ctx.fillStyle = '#f97316';
             ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        } else {
             ctx.strokeStyle = '#f3f4f6';
             ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
        break;
    }
  };

  const drawAgent = (ctx: CanvasRenderingContext2D, agent: Agent) => {
    if (agent.state !== AgentState.ALIVE && agent.state !== AgentState.JAMMED) return;

    const x = agent.position.x * CELL_SIZE;
    const y = agent.position.y * CELL_SIZE;
    const radius = agent.radius * CELL_SIZE;

    if (agent.state === AgentState.JAMMED) {
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.arc(x, y, Math.max(radius, 2), 0, Math.PI * 2);
        ctx.fill();
        return;
    }
    
    const panic = Math.max(0, Math.min(1, agent.panicLevel));
    const r = Math.floor(panic * 255);
    const g = Math.floor((1 - panic) * 255);
    ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
    
    const sizeMultiplier = 1 + panic * 0.1;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(radius * sizeMultiplier, 2), 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 bg-white shadow-sm"
    />
  );
}

