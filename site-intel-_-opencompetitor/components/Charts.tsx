import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import * as d3 from 'd3';

export const TrendChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return <div className="text-gray-500 text-sm">No trend data available.</div>;

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
          <YAxis stroke="#64748b" tick={{fontSize: 12}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
          />
          <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RevenueBarChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) return null;
    return (
        <div className="h-64 w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                     <XAxis type="number" stroke="#64748b" domain={[0, 100]} />
                     <YAxis dataKey="type" type="category" stroke="#64748b" width={100} />
                     <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                     <Bar dataKey="probability" fill="#10b981" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                        ))}
                     </Bar>
                </BarChart>
             </ResponsiveContainer>
        </div>
    )
}

// A simple simulated tree visualizer using D3 principles (rendered as SVG)
export const StructureTree = () => {
    return (
        <div className="flex justify-center py-8">
            <svg width="400" height="200" viewBox="0 0 400 200" className="opacity-80">
                <circle cx="200" cy="20" r="10" fill="#0ea5e9" />
                <line x1="200" y1="30" x2="100" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="200" y1="30" x2="300" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="200" y1="30" x2="200" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                
                <circle cx="100" cy="80" r="8" fill="#3b82f6" />
                <circle cx="200" cy="80" r="8" fill="#3b82f6" />
                <circle cx="300" cy="80" r="8" fill="#3b82f6" />

                <line x1="100" y1="90" x2="50" y2="140" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="100" y1="90" x2="150" y2="140" stroke="#cbd5e1" strokeWidth="2" />
                
                <circle cx="50" cy="140" r="6" fill="#6366f1" />
                <circle cx="150" cy="140" r="6" fill="#6366f1" />
            </svg>
        </div>
    )
}