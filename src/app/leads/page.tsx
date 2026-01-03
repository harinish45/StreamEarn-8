'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { CoursesSidebar } from '@/components/courses-sidebar';
import { Header } from '@/components/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { aiToolsPyramid, type AiTool } from '@/lib/ai-tools-data';
import { OpportunityCard } from '@/components/opportunity-card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function LeadsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className='flex items-center gap-2'>
            <CardTitle className="font-headline text-lg">
              All Leads
            </CardTitle>
             <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">Create Lead</span>
            </Button>
          </div>
        </div>
        <CardDescription className="text-muted-foreground text-sm mt-1">
          0 leads found.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    disabled
                    aria-label="Select all leads"
                  />
                </TableHead>
                <TableHead>Lead Name</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Contacted</TableHead>
                <TableHead className="w-[50px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No leads found. Click the '+' button to add your first lead.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function LeadAutomationTools() {
    const leadAutomationCategory = aiToolsPyramid.find(c => c.name === 'Lead Automation');
    const tools = leadAutomationCategory ? leadAutomationCategory.tools : [];

    const [recentlySeen, setRecentlySeen] = useState<string | null>('Clay');

    const mappedOpportunities = tools.map(tool => ({
        id: tool.name.toLowerCase().replace(/\s/g, '-'),
        title: tool.name,
        description: tool.name === 'Clay' 
            ? 'Data enrichment and outbound automation platform.' 
            : tool.name === 'Apify'
            ? 'Web scraping and automation platform to extract data from any website.'
            : tool.name === 'Hunter.io'
            ? 'Find and verify professional email addresses.'
            : tool.name === 'Clearbit'
            ? 'Marketing intelligence to understand customers and find new prospects.'
            : tool.name === 'Lusha'
            ? 'Get access to B2B contact and company details.'
            : tool.name === 'ZoomInfo'
            ? 'B2B intelligence platform for sales and marketing teams.'
            : 'Lead automation tool.',
        link: tool.link,
        logoKey: tool.logoKey,
        imageKey: 'futureAbstract', // Placeholder
        aiHint: 'logo',
        visited: recentlySeen === tool.name,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Lead Automation Tools</CardTitle>
                <CardDescription>Explore these popular platforms to automate lead generation and data enrichment.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mappedOpportunities.map(opp => (
                        <OpportunityCard key={opp.id} opportunity={opp} categoryId="lead-automation" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function LeadsPage() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background">
                <CoursesSidebar />
                <SidebarInset>
                    <Header showSidebarTrigger={true} />
                    <ScrollArea className="h-[calc(100vh-4rem)]">
                        <main className="flex-1 p-4 md:p-6 space-y-8">
                           <Breadcrumbs path={[{ name: "Leads", href: "/leads" }]} />
                           <LeadsTable />
                           <LeadAutomationTools />
                        </main>
                    </ScrollArea>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
