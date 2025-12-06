'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SimulationStats } from '@/types/simulation';

interface StatsGraphProps {
  data: SimulationStats[];
}

export default function StatsGraph({ data }: StatsGraphProps) {
  return (
    <div className="w-full h-full bg-white rounded border border-gray-100 p-4">
        <h3 className="text-xs font-medium text-gray-500 mb-3">Status over Time</h3>
        <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="timeElapsed" 
                        type="number" 
                        tickFormatter={(val) => Math.round(val).toString()} 
                        domain={['dataMin', 'dataMax']}
                        hide
                    />
                    <YAxis 
                        width={30} 
                        tick={{ fontSize: 9, fill: '#9ca3af' }}
                        stroke="#e5e7eb"
                    />
                    <Tooltip 
                        labelFormatter={(val) => `Time: ${Number(val).toFixed(1)}s`}
                        contentStyle={{ 
                            fontSize: '10px', 
                            backgroundColor: '#ffffff',
                            border: '1px solid #f3f4f6',
                            borderRadius: '4px',
                            padding: '6px'
                        }}
                        labelStyle={{ color: '#6b7280', fontWeight: 500 }}
                    />
                    <Legend 
                        iconSize={6} 
                        wrapperStyle={{ fontSize: '9px', paddingTop: '4px', color: '#9ca3af' }}
                        iconType="line"
                    />
                    
                    <Line 
                        type="monotone" 
                        dataKey="aliveCount" 
                        name="Active" 
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="evacuatedCount" 
                        name="Safe" 
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="casualtyCount" 
                        name="Dead" 
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="jammedAgentCount" 
                        name="Jammed" 
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px]">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[rgb(0,255,0)] flex-shrink-0"></div>
                    <span className="text-gray-500">Calm</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[rgb(128,128,0)] flex-shrink-0"></div>
                    <span className="text-gray-500">Anxious</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[rgb(255,0,0)] flex-shrink-0"></div>
                    <span className="text-gray-500">Panicked</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0"></div>
                    <span className="text-gray-500">Jammed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-orange-500 flex-shrink-0"></div>
                    <span className="text-gray-500">Fire</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-500">Door</span>
                </div>
            </div>
        </div>
    </div>
  );
}

