'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EnergyReading } from '@/types/property';

interface EnergyChartProps {
  data: EnergyReading[];
}

export default function EnergyChart({ data }: EnergyChartProps) {
  const chartData = data.map((reading) => ({
    date: new Date(reading.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    kWh: parseFloat(reading.kwh_consumed.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
          fontSize={12}
        />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="kWh" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}