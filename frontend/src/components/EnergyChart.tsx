'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EnergyReading } from '@/types/property';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: '7px', padding: '10px 14px' }}>
      <p style={{ fontSize: '12px', color: '#5a6070', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#d4a843' }}>{payload[0].value} kWh</p>
    </div>
  );
}

export default function EnergyChart({ data }: { data: EnergyReading[] }) {
  const chartData = data.map(r => ({
    date: new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    kWh: parseFloat(r.kwh_consumed.toFixed(2)),
  }));

  const interval = Math.max(1, Math.floor(chartData.length / 7));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a843" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#d4a843" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1d27" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#5a6070', fontSize: 11 }}
          axisLine={{ stroke: '#1a1d27' }}
          tickLine={false}
          interval={interval}
        />
        <YAxis
          tick={{ fill: '#5a6070', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a2d3a' }} />
        <Area
          type="monotone"
          dataKey="kWh"
          stroke="#d4a843"
          strokeWidth={1.5}
          fill="url(#grad)"
          dot={false}
          activeDot={{ r: 3, fill: '#d4a843', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}