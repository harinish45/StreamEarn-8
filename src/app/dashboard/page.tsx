
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Zap, Calendar, BarChart } from "lucide-react";

const features = [
  {
    icon: <CheckSquare className="h-8 w-8 text-primary" />,
    title: "Core Task Tools",
    description: "Simple checklists let you smash tasks with that satisfying check-off feel. Create organized lists for work, personal, or whatever—paid tier unlocks unlimited ones. Drag-and-drop prioritization sorts into 'Do now,' 'Tomorrow,' or 'Soon' buckets.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Focus & Timer Mode",
    description: "Blitz Mode locks in your top task with a floating timer that sticks around, no distractions popping up. Pomodoro sprints (like 60min work + 15min break) keep momentum without leaving your screen. Keyboard shortcuts (Ctrl+/ for new task, Ctrl+L to toggle tower) make it fly on desktop.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Scheduling Basics",
    description: "Estimate task time upfront, track actual vs. overtime for billing or reflection. Schedule one-off or recurring stuff with instant alerts and Google Calendar/Notion sync. Notes attach quick links or thoughts that auto-open in focus.",
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Reporting & Mobile",
    description: "Session tracking breaks down time by category (Work, Personal, Breaks) for real insights. Filter reports by list to see punctuality wins. Android/iOS betas sync everything seamless across devices.",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Your Productivity Dashboard</h1>
            <p className="mt-4 text-lg text-muted-foreground">All the tools you need to stay organized and focused.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-4">
                        {feature.icon}
                        <CardTitle className="text-2xl font-serif">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
            ))}
        </main>
      </div>
    </div>
  )
}
