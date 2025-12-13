
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const sampleData = [
  { name: 'Mon', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Tue', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Wed', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Thu', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Fri', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Sat', total: Math.floor(Math.random() * 6) + 1 },
  { name: 'Sun', total: Math.floor(Math.random() * 6) + 1 },
];

export function ReportsOverview() {
  return (
    <Card className="bg-[#1E293B] border-[#475569]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weekly Productivity</CardTitle>
        <CardDescription>Focus hours this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sampleData}>
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip
              cursor={{ fill: 'hsla(220, 13%, 40%, 0.5)' }}
              contentStyle={{
                background: '#0F172A',
                borderColor: '#475569',
                color: '#E2E8F0',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Bar dataKey="total" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
