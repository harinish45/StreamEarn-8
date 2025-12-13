
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Blitzit Feature Showcase
            </h1>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A complete breakdown of Blitzit&apos;s features, focusing on non-AI functionalities, scheduling, productivity tools, reporting, and integrations.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>1. Task Organization & Categories</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Task Lists/Collections:</strong> Ability to create multiple lists (Work, Personal, Design, Projects, etc.)</li>
                  <li><strong>Task Filtering:</strong> Filter tasks by list/category for measuring performance.</li>
                  <li><strong>Task Search:</strong> Quick search across all tasks.</li>
                  <li><strong>Recurring Tasks:</strong> Set tasks as one-time or recurring (daily, weekly, monthly, etc.).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Focus Mode Enhancements</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Blitz Mode Collapse:</strong> Collapses entire task list into floating timer, showing ONLY current task.</li>
                  <li><strong>Visual/Sound Cues:</strong> Timer alerts every 10 minutes with lighting & sound effects.</li>
                  <li><strong>Dopamine Boost:</strong> Celebratory messages/GIFs when task completed on time.</li>
                  <li><strong>Time Blindness Support:</strong> Locked floating timer that can&apos;t be minimized.</li>
                  <li><strong>Multiple Timer Modes:</strong> Pomodoro (60+15min), Custom intervals, Free-form timer.</li>
                  <li><strong>Task Completion Animation:</strong> Satisfying visual feedback when task is marked done.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. Notes & Voice Recording</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Task Notes:</strong> Attach notes, links, or fleeting thoughts to tasks.</li>
                  <li><strong>Auto-Open Links:</strong> Automatically open linked content when task is active.</li>
                  <li><strong>Voice/Meeting Recording:</strong> Record voice notes or meetings directly into task notes.</li>
                  <li><strong>Note Timestamps:</strong> Timestamp notes for reference.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>4. Time Tracking & Analytics</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Estimated Time vs. Actual Time:</strong> Users estimate task duration, app tracks actual time spent.</li>
                  <li><strong>Overtime Tracking:</strong> Track time spent beyond estimate.</li>
                  <li><strong>Time Billing Support:</strong> Export time data for client billing.</li>
                  <li><strong>Session Tracking (BETA):</strong> Organize every session, account for every minute.</li>
                  <li><strong>Time Allocation by Category:</strong> Breakdown of time spent on Work, Design, Personal, Break.</li>
                  <li><strong>Punctuality Review:</strong> Reflect on time estimate accuracy.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>5. Reporting & Insights</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Reports Overview Dashboard:</strong> Bird&apos;s eye view of productivity & behavior.</li>
                  <li><strong>Performance Metrics:</strong> Track productivity across all lists.</li>
                  <li><strong>Deep Time Analysis:</strong> Understand time allocation patterns.</li>
                  <li><strong>PDF Export:</strong> Download performance reports as PDF.</li>
                  <li><strong>Weekly/Monthly Summaries:</strong> Aggregated productivity reports.</li>
                  <li><strong>Custom Date Range Reports:</strong> Analyze productivity for any time period.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>6. Scheduling Features</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Recurring Task Management:</strong> Edit/manage recurring instances.</li>
                  <li><strong>Task Alerts/Reminders:</strong> Instant notifications for upcoming scheduled tasks.</li>
                  <li><strong>Calendar View:</strong> Visual calendar showing scheduled tasks.</li>
                  <li><strong>Drag-and-drop Scheduling:</strong> Reschedule tasks by dragging on calendar.</li>
                  <li><strong>Conflict Detection:</strong> Warn if scheduling conflicts exist.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>7. Task Prioritization (Eisenhower Matrix)</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Eisenhower Matrix:</strong> 4-quadrant prioritization: Do Today (Important + Urgent), Schedule (Important), Later Today (Urgent), Backlog (Neither).</li>
                  <li><strong>Smart Sorting:</strong> Auto-sort tasks by importance & urgency.</li>
                  <li><strong>Quick Prioritization UI:</strong> Easy buttons to move between quadrants.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>8. Collaboration Features</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Share Lists:</strong> Share task lists with team members.</li>
                  <li><strong>Collaborative Editing:</strong> Work together on lists in real-time.</li>
                  <li><strong>Permission Levels:</strong> Control who can view/edit/delete tasks.</li>
                  <li><strong>Activity Log:</strong> See who edited what and when.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>9. Customization & Accessibility</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dark/Light Mode Toggle:</strong> Switch themes or use system settings.</li>
                  <li><strong>Keyboard Shortcuts:</strong> Quick actions (create task, draft notes, hide/show app).</li>
                  <li><strong>Custom Colors/Themes:</strong> Allow users to personalize colors.</li>
                  <li><strong>Font Size Adjustment:</strong> Support for accessibility.</li>
                  <li><strong>High Contrast Mode:</strong> For visually impaired users.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>10. Break Time & Wellness</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Break Reminders:</strong> Suggest break after focused work.</li>
                  <li><strong>Break Ideas:</strong> Provide rejuvenating suggestions during breaks (65% DONE).</li>
                  <li><strong>Stretch Exercises:</strong> Short exercise suggestions.</li>
                  <li><strong>Meditation/Breathing Guides:</strong> Quick mindfulness exercises.</li>
                  <li><strong>Break Time Tracking:</strong> Track rest periods.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-11">
              <AccordionTrigger>11. Gamification</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Streak System:</strong> Track Day Streak, Week Streak, Month Streak.</li>
                  <li><strong>Level/Rank System:</strong> Users level up based on completed tasks.</li>
                  <li><strong>Achievements/Badges:</strong> Unlock badges for milestones.</li>
                  <li><strong>Leaderboards:</strong> Optional competitive rankings.</li>
                  <li><strong>Challenge System:</strong> Set challenges to move up ranks.</li>
                  <li><strong>Progress Visualization:</strong> Show progress bars/visual feedback.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12">
              <AccordionTrigger>12. Platform Support & Sync</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cross-Device Sync:</strong> 100% sync across macOS, Windows, iOS, Android.</li>
                  <li><strong>Offline Mode:</strong> Work offline and sync when online.</li>
                  <li><strong>Mobile App (iOS/Android):</strong> Native mobile experience.</li>
                  <li><strong>Web App PWA:</strong> Progressive web app for browser.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-13">
              <AccordionTrigger>13. Integrations</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Calendar Sync:</strong> Two-way sync with Google Calendar.</li>
                  <li><strong>Notion Integration:</strong> Create/update Notion pages from tasks.</li>
                  <li><strong>ClickUp Integration:</strong> Sync with ClickUp workspaces.</li>
                  <li><strong>Figma Comments Sync:</strong> Pull Figma comment tasks (planned).</li>
                  <li><strong>Trello Integration:</strong> Sync with Trello boards (planned).</li>
                  <li><strong>Asana Integration:</strong> Sync with Asana projects (planned).</li>
                  <li><strong>Linear Integration:</strong> Sync with Linear issues (planned).</li>
                  <li><strong>Webhooks:</strong> Custom integrations (planned).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14">
              <AccordionTrigger>14. Workflow Features</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Weekly Planning Mode:</strong> Dedicated view for planning week.</li>
                  <li><strong>Daily Standup:</strong> Quick daily planning ritual.</li>
                  <li><strong>Win the Day Feature:</strong> End-of-day reflection & celebration.</li>
                  <li><strong>Momentum Building:</strong> Progressive task completion boost.</li>
                  <li><strong>Task Templates:</strong> Save & reuse common task setups.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-15">
              <AccordionTrigger>15. Task State & Organization</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Task Statuses:</strong> Do now, Do later, Tomorrow, Soon, Done, Archived.</li>
                  <li><strong>Drag-and-drop Reordering:</strong> Reorganize task lists easily.</li>
                  <li><strong>Bulk Actions:</strong> Bulk edit multiple tasks.</li>
                  <li><strong>Task Subtasks:</strong> Break tasks into smaller subtasks.</li>
                  <li><strong>Task Dependencies:</strong> Mark task B as dependent on task A.</li>
                  <li><strong>Task Duplication:</strong> Quick duplicate for similar tasks.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-16">
              <AccordionTrigger>16. Notifications & Reminders</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Desktop Notifications:</strong> Native OS notifications for reminders.</li>
                  <li><strong>Sound Alerts:</strong> Customizable notification sounds.</li>
                  <li><strong>Snooze Feature:</strong> Snooze reminders for later.</li>
                  <li><strong>Quiet Hours:</strong> Disable notifications during specific times.</li>
                  <li><strong>Smart Reminders:</strong> Suggest optimal reminder times.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-17">
              <AccordionTrigger>17. Data & Privacy</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Data Export:</strong> Export all data in JSON/CSV format.</li>
                  <li><strong>Backup & Restore:</strong> Automatic cloud backups.</li>
                  <li><strong>Data Encryption:</strong> End-to-end encryption for sensitive tasks.</li>
                  <li><strong>GDPR Compliance:</strong> User data controls.</li>
                  <li><strong>Account Deletion:</strong> Permanent data removal option.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </main>
    </div>
  );
}
