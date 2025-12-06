import React from 'react';
import { SimulationConfig } from '@/types/simulation';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface SidebarProps {
  config: SimulationConfig;
  isRunning: boolean;
  onConfigChange: (config: SimulationConfig) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onScenarioChange: (scenario: 'REAL' | 'INTERMEDIATE' | 'IDEAL') => void;
}

export default function Sidebar({
  config,
  isRunning,
  onConfigChange,
  onStart,
  onPause,
  onReset,
  onScenarioChange
}: SidebarProps) {

  const handleChange = (key: keyof SimulationConfig, value: number | string) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white border-r h-full overflow-y-auto w-[320px] flex-shrink-0">
      
      <div>
        <h1 className="text-xl font-bold text-gray-900 leading-tight">Fire Evacuation Simulation</h1>
        <p className="text-xs text-gray-500 mt-1">Multi-Agent System</p>
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Controls</h3>
        <div className="flex gap-2">
            {!isRunning ? (
            <button onClick={onStart} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 shadow-sm transition-colors font-medium">
                <Play size={18} fill="currentColor" /> Start
            </button>
            ) : (
            <button onClick={onPause} className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 shadow-sm transition-colors font-medium">
                <Pause size={18} fill="currentColor" /> Pause
            </button>
            )}
            <button onClick={onReset} className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 rounded-md hover:bg-gray-200 shadow-sm border border-gray-200 transition-colors" title="Reset Simulation">
            <RotateCcw size={18} />
            </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Scenarios</h3>
        <div className="flex flex-col gap-2">
            {(['REAL', 'INTERMEDIATE', 'IDEAL'] as const).map(s => (
                <button
                    key={s}
                    onClick={() => onScenarioChange(s)}
                    className={`py-2 px-3 rounded-md text-left text-sm border transition-colors ${
                        config.scenario === s 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                    {s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ')}
                </button>
            ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Parameters</h3>
        
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 flex justify-between">
            <span>Total Agents</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{config.totalAgents}</span>
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={config.totalAgents}
            onChange={(e) => handleChange('totalAgents', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 flex justify-between">
            <span>Time Scale</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{config.timeScale}x</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={config.timeScale}
            onChange={(e) => handleChange('timeScale', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 flex justify-between">
            <span>Panic Threshold</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{config.panicThreshold.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.panicThreshold}
            onChange={(e) => handleChange('panicThreshold', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 flex justify-between">
            <span>Door Jam Sensitivity</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{config.doorJamSensitivity.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={config.doorJamSensitivity}
            onChange={(e) => handleChange('doorJamSensitivity', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 flex justify-between">
            <span>Fire Spread Interval (s)</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{config.fireSpreadSpeed.toFixed(1)}s</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={config.fireSpreadSpeed}
            onChange={(e) => handleChange('fireSpreadSpeed', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-[10px] text-gray-400 text-right">Lower = Faster fire</p>
        </div>
      </div>
      
      <div className="mt-auto pt-6 text-xs text-gray-400 text-center">
        v1.0.0
      </div>
    </div>
  );
}

