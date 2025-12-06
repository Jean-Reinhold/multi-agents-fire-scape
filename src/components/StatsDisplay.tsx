import React from 'react';
import { SimulationStats } from '@/types/simulation';

interface StatsDisplayProps {
  stats: SimulationStats;
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Evacuated</span>
        <span className="text-3xl font-bold text-gray-900">{stats.evacuatedCount}</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Casualties</span>
        <span className="text-3xl font-bold text-gray-900">{stats.casualtyCount}</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Active</span>
        <span className="text-3xl font-bold text-gray-900">{stats.aliveCount}</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Jams Occurred</span>
        <span className="text-3xl font-bold text-gray-900">{stats.jamCount}</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Elapsed</span>
        <span className="text-3xl font-bold text-gray-900">{stats.timeElapsed.toFixed(1)}s</span>
      </div>
    </div>
  );
}

