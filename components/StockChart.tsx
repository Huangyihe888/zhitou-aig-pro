import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockChartProps {
  stockName: string;
  isPositive: boolean;
}

// Generate mock intraday data to make the UI look alive
// In a production app, this would be real API data.
const generateMockData = (seed: string, isPositive: boolean) => {
  const data = [];
  let price = 100 + (seed.length % 50); // Arbitrary start price based on name length
  for (let i = 0; i < 48; i++) { // 48 points (every 5 mins for 4 hours)
    const time = `${9 + Math.floor(i / 12)}:${(i % 12) * 5}`.replace(/:0$/, ':00').replace(/:5$/, ':05');
    
    // Random walk
    const change = (Math.random() - 0.45) * 2; 
    // Bias towards the `isPositive` trend
    const trendBias = isPositive ? 0.2 : -0.2;
    
    price = price + change + trendBias;
    if (price < 0) price = 1;

    data.push({
      time,
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

const StockChart: React.FC<StockChartProps> = ({ stockName, isPositive }) => {
  const data = useMemo(() => generateMockData(stockName, isPositive), [stockName, isPositive]);
  
  const color = isPositive ? '#ef4444' : '#22c55e'; // Red up, Green down (China)

  return (
    <div className="w-full h-64 bg-dark-card rounded-xl p-4 shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-dark-muted text-sm font-medium">模拟日内走势 (Mock)</h3>
        <span className={`text-xs px-2 py-1 rounded ${isPositive ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
          {isPositive ? '+Trend' : '-Trend'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{fontSize: 10, fill: '#94a3b8'}} 
            axisLine={false}
            tickLine={false}
            interval={11}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{fontSize: 10, fill: '#94a3b8'}} 
            axisLine={false} 
            tickLine={false}
            width={35}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: color }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;