'use client';

import React, { useEffect, useRef, useState } from 'react';
import SimulationCanvas from '@/components/SimulationCanvas';
import Controls from '@/components/Controls';
import { SimulationEngine } from '@/simulation/Engine';
import { SimulationConfig, SimulationStats } from '@/types/simulation';
import { generateAgents, generateScenarioGrid } from '@/utils/scenarios';
import { GRID_HEIGHT, GRID_WIDTH } from '@/utils/grid';
import { Users, AlertTriangle, Zap, Clock } from 'lucide-react';

import StatsGraph from '@/components/StatsGraph';
import { Play, Pause, RotateCcw } from 'lucide-react';

const INITIAL_CONFIG: SimulationConfig = {
  width: GRID_WIDTH,
  height: GRID_HEIGHT,
  cellSize: 20,
  scenario: 'REAL',
  totalAgents: 200,
  panicThreshold: 0.3,
  doorJamSensitivity: 0.5,
  timeScale: 1.0,
  fireSpreadSpeed: 1.0,
};

export default function Home() {
  const [config, setConfig] = useState<SimulationConfig>(INITIAL_CONFIG);
  const [stats, setStats] = useState<SimulationStats>({ evacuatedCount: 0, casualtyCount: 0, timeElapsed: 0, jamCount: 0, aliveCount: 0, jammedAgentCount: 0 });
  const [statsHistory, setStatsHistory] = useState<SimulationStats[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const engineRef = useRef<SimulationEngine | null>(null);

  useEffect(() => {
    if (!engineRef.current) {
        const grid = generateScenarioGrid(config.scenario);
        const engine = new SimulationEngine(config, grid);
        const agents = generateAgents(config.totalAgents, grid);
        engine.initAgents(agents);
        engineRef.current = engine;
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
      if (engineRef.current) {
          engineRef.current.config = config;
      }
  }, [config]);

  const handleScenarioChange = (scenario: 'REAL' | 'INTERMEDIATE' | 'IDEAL') => {
      const newConfig = { ...config, scenario };
      setConfig(newConfig);
      
      if (engineRef.current) {
          const grid = generateScenarioGrid(scenario);
          engineRef.current.setGrid(grid);
          
          const agents = generateAgents(config.totalAgents, grid);
          engineRef.current.initAgents(agents);
          engineRef.current.reset(agents);
          
          setIsRunning(false);
          setStats({ evacuatedCount: 0, casualtyCount: 0, timeElapsed: 0, jamCount: 0, aliveCount: agents.length, jammedAgentCount: 0 });
          setStatsHistory([]);
      }
  };

  useEffect(() => {
      const interval = setInterval(() => {
          if (engineRef.current && isRunning) {
              const currentStats = { ...engineRef.current.stats };
              setStats(currentStats);
              
              setStatsHistory(prev => {
                  if (prev.length > 200) {
                       return [...prev.slice(1), currentStats];
                  }
                  return [...prev, currentStats];
              });
          }
      }, 500);
      return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
      if (engineRef.current) {
          engineRef.current.start();
          setIsRunning(true);
      }
  };

  const handlePause = () => {
      if (engineRef.current) {
          engineRef.current.pause();
          setIsRunning(false);
      }
  };

  const handleReset = () => {
      if (engineRef.current) {
          const grid = generateScenarioGrid(config.scenario);
          const agents = generateAgents(config.totalAgents, grid);
          engineRef.current.initAgents(agents);
          engineRef.current.reset(agents);
          setIsRunning(false);
          setStats({ ...engineRef.current.stats });
          setStatsHistory([]);
      }
  };

  const handleConfigChange = (newConfig: SimulationConfig) => {
      setConfig(newConfig);
      if (newConfig.totalAgents !== config.totalAgents) {
      }
  };

  if (!isLoaded || !engineRef.current) return <div className="flex h-screen items-center justify-center text-gray-400 text-sm">Loading...</div>;

  return (
    <main className="flex h-screen w-full bg-white text-gray-900 overflow-hidden">
        <div className="flex flex-col h-full border-r border-gray-100 bg-white w-[280px] overflow-hidden">
            <div className="flex-1 overflow-y-auto pt-32 px-5">
                <Controls
                    config={config}
                    stats={stats}
                    isRunning={isRunning}
                    onConfigChange={handleConfigChange}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                    onScenarioChange={handleScenarioChange}
                />
            </div>
        </div>

        <div className="flex-1 flex flex-col p-8 h-full">
            <header className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">Fire Evacuation Simulation</h1>
                    <p className="text-gray-400 text-xs mt-1">Multi-Agent System</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={config.scenario}
                        onChange={(e) => handleScenarioChange(e.target.value as 'REAL' | 'INTERMEDIATE' | 'IDEAL')}
                        className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs hover:border-gray-300 transition-colors cursor-pointer focus:outline-none focus:border-gray-400"
                    >
                        {(['REAL', 'INTERMEDIATE', 'IDEAL'] as const).map(s => (
                            <option key={s} value={s}>
                                {s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                    {!isRunning ? (
                        <button 
                            onClick={handleStart} 
                            className="flex items-center justify-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-800 transition-colors"
                        >
                            <Play size={12} fill="currentColor" /> Start
                        </button>
                    ) : (
                        <button 
                            onClick={handlePause} 
                            className="flex items-center justify-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-800 transition-colors"
                        >
                            <Pause size={12} fill="currentColor" /> Pause
                        </button>
                    )}
                    <button 
                        onClick={handleReset} 
                        className="flex items-center justify-center gap-1.5 bg-white text-gray-600 px-2.5 py-1.5 rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        title="Reset Simulation"
                    >
                        <RotateCcw size={12} />
                    </button>
                </div>
            </header>
            
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                 <div className="relative">
                     <SimulationCanvas 
                        engine={engineRef.current} 
                        width={800} 
                        height={600} 
                     />
                 </div>
            </div>
        </div>

        <div className="flex flex-col h-full border-l border-gray-100 bg-white w-[400px] overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <div className="p-5">
                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded border border-gray-100 p-4">
                            <h2 className="text-xs font-medium text-gray-500 mb-4">Statistics</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Users size={12} className="text-gray-400" />
                                        <div className="text-[10px] font-medium text-gray-500">Evacuated</div>
                                    </div>
                                    <div className="text-xl font-medium text-gray-900">{stats.evacuatedCount}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <AlertTriangle size={12} className="text-gray-400" />
                                        <div className="text-[10px] font-medium text-gray-500">Casualties</div>
                                    </div>
                                    <div className="text-xl font-medium text-gray-900">{stats.casualtyCount}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Zap size={12} className="text-gray-400" />
                                        <div className="text-[10px] font-medium text-gray-500">Jams</div>
                                    </div>
                                    <div className="text-xl font-medium text-gray-900">{stats.jamCount}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Users size={12} className="text-gray-400" />
                                        <div className="text-[10px] font-medium text-gray-500">Active</div>
                                    </div>
                                    <div className="text-xl font-medium text-gray-900">{stats.aliveCount}</div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                                <Clock size={14} className="text-gray-400" />
                                <div className="text-xs text-gray-600">
                                    Time: <span className="text-gray-900">{stats.timeElapsed.toFixed(1)}s</span>
                                </div>
                            </div>
                        </div>
                        
                        <StatsGraph data={statsHistory} />
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}
