'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>Weekly Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sampleData}>
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
              cursor={{ fill: 'hsl(var(--accent))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Hours
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}