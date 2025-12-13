
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <span className="text-muted-foreground">{children}</span>
    </li>
);


export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-12">
                <main className="flex-1 space-y-12">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Blitzit Features</h1>
                        <p className="text-lg text-muted-foreground">Your Productivity Superpower</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Core Productivity and Task Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6 text-muted-foreground">
                                Blitzit functions as a tool built around a simple to-do list designed to give users sharp focus. The recommended workflow follows four non-AI steps: Plan your week/day, Go into Focus Mode, Get momentum, and Win the day & relax.
                            </p>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>To-Do List and Organization</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>The core functionality is a simple to-do list paired with a smart timer.</FeatureListItem>
                                            <FeatureListItem>Users can create lists to centralize and organize tasks for different purposes.</FeatureListItem>
                                            <FeatureListItem>The app offers satisfying checklists.</FeatureListItem>
                                            <FeatureListItem>Tasks can be organized and prioritized into categories such as Do now, Do later, Tomorrow, or Soon.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Focus and Accountability Tools</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>Focus Mode (also called Blitz Mode) collapses the list into a floating countdown timer, keeping the current task visible to keep the user focused and helps crush tasks throughout the day.</FeatureListItem>
                                            <FeatureListItem>The system uses a locked floating timer that stays on the screen, which is helpful for users dealing with time blindness.</FeatureListItem>
                                            <FeatureListItem>Dopamine boosts are provided via celebratory messages or small GIFs when tasks are completed on time.</FeatureListItem>
                                            <FeatureListItem>The timer provides visual and sound cues, lighting up and making a sound every 10 minutes, offering help with time blindness.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Notes and Details</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>Users can attach notes to tasks, including links or any fleeting thoughts, and the app is designed to auto open links when the task is active.</FeatureListItem>
                                            <FeatureListItem>The app includes the ability to record your voice or meetings directly into task notes.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Customization and Accessibility (LIVE Features)</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>The application can be personalized by users.</FeatureListItem>
                                            <FeatureListItem>Dark/Light Mode is available, allowing users to use system settings or choose a theme.</FeatureListItem>
                                            <FeatureListItem>Keyboard Shortcuts enable quick actions like creating tasks, drafting notes, or hiding/showing the Blitzit tower.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduling and Time Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="mb-6 text-muted-foreground">
                                Blitzit provides integrated scheduling and time-tracking features to manage workload efficiently.
                            </p>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Time Management</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>The application supports various timer modes.</FeatureListItem>
                                            <FeatureListItem>Users can estimate how long a task will take and subsequently track done time and overtime. This tracking helps users refer back to time spent when billing clients.</FeatureListItem>
                                            <FeatureListItem>The application uses the Pomodoro Technique to allow working in fixed intervals and breaks, such as a 60-minute work sprint followed by a 15-minute break.</FeatureListItem>
                                            <FeatureListItem>Tasks can be scheduled as one-time or recurring events.</FeatureListItem>
                                            <FeatureListItem>Alerts provide instant reminders for upcoming scheduled tasks.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reporting and Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6 text-muted-foreground">
                                The application provides several non-AI features aimed at giving users insight into their productivity behavior for improvement.
                            </p>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Reports and Metrics</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>A Reports overview provides a bird's eye view of overall productivity and behavior.</FeatureListItem>
                                            <FeatureListItem>The app includes Sessions Tracking (BETA), which organizes every session and accounts for every minute, intending to replace manual timers like Clockify and Toggl.</FeatureListItem>
                                            <FeatureListItem>Users can measure time spent to gain a deep understanding of time allocation across categories like Work, Design, Personal, and Break.</FeatureListItem>
                                            <FeatureListItem>The ability to filter through lists allows measuring performance on different task groupings.</FeatureListItem>
                                            <FeatureListItem>Review punctuality allows reflection on setting realistic time estimates.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Future Reporting</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>Export reports are coming soon, allowing users to download a PDF report of performance across all lists.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Integrations and Platform Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="mb-6 text-muted-foreground">
                                Blitzit supports synchronization to centralize workflows and operates across multiple platforms.
                            </p>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Live Integrations</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>Google Calendar integration is live.</FeatureListItem>
                                            <FeatureListItem>Notion integration is live.</FeatureListItem>
                                            <FeatureListItem>ClickUp integration is live.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Planned Integrations (24% DONE)</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>The app plans to add integrations for Figma comments, Trello Tasks, Asana Tasks, Linear, and Webhooks to centralize workflows further.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Platform Support and Sync</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-4">
                                            <FeatureListItem>The app is available for macOS 12.3 or later (Intel & Apple Silicon) and Windows 10 and 11.</FeatureListItem>
                                            <FeatureListItem>Mobile App (Android & iOS beta) apps are currently out, enabling task management on the go with 100% sync across all devices.</FeatureListItem>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Future/Planned Features (Non-AI)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4 pl-4">
                                <FeatureListItem>Break Time (65% DONE): A feature to provide rejuvenating ideas during breaks.</FeatureListItem>
                                <FeatureListItem>Eisenhower Matrix: A planned technique to easily prioritize tasks into categories: Do Today (Important + Urgent), Schedule (Important), Later Today (Urgent), and Backlog (Neither).</FeatureListItem>
                                <FeatureListItem>Collaborate on lists: A feature to share the workload and work together on lists.</FeatureListItem>
                                <FeatureListItem>Gamified productivity: A planned system to level up focus and challenge users to move up the ranks via streaks (e.g., Day Streak, Week Streak).</FeatureListItem>
                                <FeatureListItem>Apple Watch: Planned task focus sessions on the move.</FeatureListItem>
                            </ul>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
