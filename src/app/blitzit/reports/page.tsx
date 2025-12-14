'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const categoryData = [
    { name: 'Work', value: 400, fill: 'hsl(var(--primary))' },
    { name: 'Personal', value: 300, fill: 'hsl(var(--secondary))' },
    { name: 'Design', value: 300, fill: 'hsl(var(--warning))' },
    { name: 'Break', value: 200, fill: 'hsl(var(--success))' },
];

const dailyData = [
  { name: 'Mon', tasks: 5, hours: 2.5 },
  { name: 'Tue', tasks: 8, hours: 4 },
  { name: 'Wed', tasks: 3, hours: 1.5 },
  { name: 'Thu', tasks: 6, hours: 3 },
  { name: 'Fri', tasks: 7, hours: 3.5 },
  { name: 'Sat', tasks: 4, hours: 2 },
  { name: 'Sun', tasks: 2, hours: 1 },
];


export default function ReportsPage() {
    return (
        <div className="p-8 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <p className="text-muted-foreground">Analyze your productivity and focus.</p>
                </div>
                <div className="flex gap-2">
                     <Select defaultValue="this-week">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="last-week">Last Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Tasks Completed</CardTitle>
                        <CardDescription>This Week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">32</p>
                        <p className="text-xs text-muted-foreground">+10% from last week</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Focus Hours</CardTitle>
                        <CardDescription>This Week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">18.5h</p>
                        <p className="text-xs text-muted-foreground">-5% from last week</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Avg. Session</CardTitle>
                        <CardDescription>Minutes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">42m</p>
                        <p className="text-xs text-muted-foreground">+2m from last week</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Completion Rate</CardTitle>
                        <CardDescription>On Time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">88%</p>
                        <p className="text-xs text-muted-foreground">+3% from last week</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-3 grid gap-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground">Weekly Productivity</CardTitle>
                            <CardDescription>Tasks completed and focus hours per day.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dailyData}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'hsla(var(--accent))' }}
                                        contentStyle={{
                                            background: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                            color: 'hsl(var(--foreground))',
                                            borderRadius: 'var(--radius)',
                                        }}
                                    />
                                    <Bar yAxisId="left" dataKey="tasks" fill="hsl(var(--primary))" name="Tasks" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="hours" fill="hsl(var(--secondary))" name="Hours" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-foreground">Time by Category</CardTitle>
                            <CardDescription>How you've allocated your focus time.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        cursor={{ fill: 'hsla(var(--accent))' }}
                                        contentStyle={{
                                            background: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                            color: 'hsl(var(--foreground))',
                                            borderRadius: 'var(--radius)',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
