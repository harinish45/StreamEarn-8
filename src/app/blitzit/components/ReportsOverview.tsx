
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const generateSampleData = () => [
  { name: 'Mon', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Tue', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Wed', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Thu', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Fri', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Sat', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Sun', total: Math.floor(Math.random() * 6) + 1 },
];

export function ReportsOverview() {
  const [data, setData] = useState(generateSampleData());

  useEffect(() => {
    // This hook ensures the random data is generated on the client-side
    // avoiding server-client mismatch in hydration.
    setData(generateSampleData());
  }, []);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Weekly Productivity</CardTitle>
        <CardDescription>Focus hours this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              cursor={{ fill: 'hsla(var(--accent))' }}
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="total" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
