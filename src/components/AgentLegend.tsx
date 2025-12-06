import React from 'react';

export default function AgentLegend() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Agent Legend</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[rgb(0,255,0)] border-2 border-gray-300 shadow-sm flex-shrink-0"></div>
          <span className="text-sm text-gray-700">Calm (Low Panic)</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[rgb(128,128,0)] border-2 border-gray-300 shadow-sm flex-shrink-0"></div>
          <span className="text-sm text-gray-700">Anxious (Medium Panic)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[rgb(255,0,0)] border-2 border-gray-300 shadow-sm flex-shrink-0"></div>
          <span className="text-sm text-gray-700">Panicked (High Panic)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-purple-600 border-2 border-gray-300 shadow-sm flex-shrink-0"></div>
          <span className="text-sm text-gray-700">Jammed / Stuck</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-orange-500 border-2 border-gray-300 shadow-sm flex-shrink-0"></div>
          <span className="text-sm text-gray-700">Fire</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-gray-300 shadow-sm flex-shrink-0"></div>
          <span className="text-sm text-gray-700">Revolving Door</span>
        </div>
      </div>
    </div>
  );
}

