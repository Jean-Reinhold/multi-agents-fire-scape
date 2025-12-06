'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Cell, CellType } from '@/types/simulation';
import { createEmptyGrid, GRID_HEIGHT, GRID_WIDTH } from '@/utils/grid';
import clsx from 'clsx';
import { Eraser, DoorOpen, BrickWall, RotateCw, Square } from 'lucide-react';

interface MapEditorProps {
  initialGrid?: Cell[][];
  onSave: (grid: Cell[][]) => void;
}

export default function MapEditor({ initialGrid, onSave }: MapEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Cell[][]>(initialGrid || createEmptyGrid(GRID_WIDTH, GRID_HEIGHT));
  const [selectedTool, setSelectedTool] = useState<CellType>(CellType.WALL);
  const [isDrawing, setIsDrawing] = useState(false);

  const CELL_PX = 20;

  useEffect(() => {
    drawGrid();
  }, [grid]);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = grid[y][x];
        ctx.fillStyle = getCellColor(cell.type);
        ctx.fillRect(x * CELL_PX, y * CELL_PX, CELL_PX, CELL_PX);
        
        ctx.strokeStyle = '#e5e7eb';
        ctx.strokeRect(x * CELL_PX, y * CELL_PX, CELL_PX, CELL_PX);
      }
    }
  };

  const getCellColor = (type: CellType) => {
    switch (type) {
      case CellType.WALL: return '#1f2937';
      case CellType.EXIT: return '#22c55e';
      case CellType.REVOLVING_DOOR: return '#eab308';
      case CellType.EMPTY: return '#ffffff';
      default: return '#ffffff';
    }
  };

  const handleCanvasEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_PX);
    const y = Math.floor((e.clientY - rect.top) / CELL_PX);

    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      updateCell(x, y);
    }
  };

  const updateCell = (x: number, y: number) => {
    setGrid(prev => {
      const newGrid = [...prev.map(row => [...row])];
      newGrid[y][x] = { ...newGrid[y][x], type: selectedTool };
      return newGrid;
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleCanvasEvent(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      handleCanvasEvent(e);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded shadow-sm bg-white">
      <div className="flex gap-2 mb-2">
        <ToolButton 
          active={selectedTool === CellType.WALL} 
          onClick={() => setSelectedTool(CellType.WALL)}
          icon={<BrickWall size={16} />}
          label="Wall"
        />
        <ToolButton 
          active={selectedTool === CellType.EXIT} 
          onClick={() => setSelectedTool(CellType.EXIT)}
          icon={<DoorOpen size={16} />}
          label="Exit"
        />
        <ToolButton 
          active={selectedTool === CellType.REVOLVING_DOOR} 
          onClick={() => setSelectedTool(CellType.REVOLVING_DOOR)}
          icon={<RotateCw size={16} />}
          label="Rev. Door"
        />
        <ToolButton 
          active={selectedTool === CellType.EMPTY} 
          onClick={() => setSelectedTool(CellType.EMPTY)}
          icon={<Eraser size={16} />}
          label="Erase"
        />
      </div>

      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * CELL_PX}
        height={GRID_HEIGHT * CELL_PX}
        className="border border-gray-300 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
        onClick={() => onSave(grid)}
      >
        Save Layout
      </button>
    </div>
  );
}

function ToolButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors",
        active ? "bg-blue-100 text-blue-800 border-blue-200 border" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

