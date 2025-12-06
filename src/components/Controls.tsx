'use client';

import React from 'react';
import { SimulationConfig, SimulationStats } from '@/types/simulation';

interface ControlsProps {
  config: SimulationConfig;
  stats: SimulationStats;
  isRunning: boolean;
  onConfigChange: (config: SimulationConfig) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onScenarioChange: (scenario: 'REAL' | 'INTERMEDIATE' | 'IDEAL') => void;
}

export default function Controls({
  config,
  stats,
  isRunning,
  onConfigChange,
  onStart,
  onPause,
  onReset,
  onScenarioChange
}: ControlsProps) {

  const handleChange = (key: keyof SimulationConfig, value: number | string) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="flex flex-col">
      <div className="bg-white rounded border border-gray-100 p-4">
        <h3 className="text-xs font-medium text-gray-500 mb-5">Parameters</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-gray-500 flex justify-between items-center">
              <span>Total Agents</span>
              <span className="text-gray-900 font-medium text-xs">{config.totalAgents}</span>
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={config.totalAgents}
              onChange={(e) => handleChange('totalAgents', parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 flex justify-between items-center">
              <span>Time Scale</span>
              <span className="text-gray-900 font-medium text-xs">{config.timeScale}x</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={config.timeScale}
              onChange={(e) => handleChange('timeScale', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 flex justify-between items-center">
              <span>Panic Threshold</span>
              <span className="text-gray-900 font-medium text-xs">{config.panicThreshold.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.panicThreshold}
              onChange={(e) => handleChange('panicThreshold', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 flex justify-between items-center">
              <span>Door Jam Sensitivity</span>
              <span className="text-gray-900 font-medium text-xs">{config.doorJamSensitivity.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={config.doorJamSensitivity}
              onChange={(e) => handleChange('doorJamSensitivity', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500 flex justify-between items-center">
              <span>Fire Spread Interval</span>
              <span className="text-gray-900 font-medium text-xs">{config.fireSpreadSpeed.toFixed(1)}s</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={config.fireSpreadSpeed}
              onChange={(e) => handleChange('fireSpreadSpeed', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-gray-900"
            />
            <p className="text-[10px] text-gray-400 text-right">Lower = Faster fire spread</p>
          </div>
        </div>
      </div>
    </div>
  );
}

