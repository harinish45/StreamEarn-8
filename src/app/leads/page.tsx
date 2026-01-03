'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Lead } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  ChevronsUpDown,
  Trash2,
  Search,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser, useFirestore, useCollection } from '@/firebase';
import {
  updateLead,
  updateLeads,
  deleteLeads,
  createLead,
} from '@/firebase/firestore/leads';
import { collection, query, where } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { CoursesSidebar } from '@/components/courses-sidebar';
import { Header } from '@/components/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Breadcrumbs } from '@/components/breadcrumbs';

const statusOptions: Lead['status'][] = [
  'New',
  'Contacted',
  'Qualified',
  'Closed',
  'Lost',
  'Dead',
];
const priorityOptions: Lead['priority'][] = [
  'Hot',
  'Warm',
  'Cold',
];

const statusColors: Record<Lead['status'], string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Contacted:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Qualified:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  Closed:
    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Dead: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
};

const priorityUIMap: Record<
  Lead['priority'],
  { color: string; display: string }
> = {
  Hot: { color: 'text-red-500', display: 'Hot' },
  Warm: { color: 'text-yellow-500', display: 'Warm' },
  Cold: { color: 'text-blue-500', display: 'Cold' },
} as const;

function CreateLeadDialog({ onAdd }: { onAdd: (lead: Omit<Lead, 'id' | 'ownerId'>) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [property, setProperty] = useState('');
  const { toast } = useToast();

  const handleAddLead = () => {
    if (!name || !email || !property) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields to create a lead.',
        variant: 'destructive',
      });
      return;
    }
    const newLead = {
      name,
      email,
      property,
      status: 'New' as const,
      priority: 'Cold' as const,
      isFraudulent: false,
      lastContacted: new Date().toISOString().split('T')[0],
      leadData: `Name: ${name}, Email: ${email}, Property: ${property}`,
    };
    onAdd(newLead);
    toast({
        title: 'Lead Created',
        description: `${name} has been added to your leads.`,
    })
    setOpen(false);
    setName('');
    setEmail('');
    setProperty('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only">Create Lead</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
          <DialogDescription>
            Enter the details for the new lead below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="Lead's full name" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" className="col-span-3" placeholder="lead@example.com" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="property" className="text-right">
              Property
            </Label>
            <Input id="property" value={property} onChange={e => setProperty(e.target.value)} className="col-span-3" placeholder="Property they are interested in" />
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLead}>Create Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LeadsComponent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { toast } = useToast();

  const leadsQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, `users/${user.uid}/leads`));
  }, [firestore, user?.uid]);

  const {
    data: allLeads,
    loading: isLoading,
    update,
    add,
    remove,
  } = useCollection<Lead>(leadsQuery, { listen: true });

  const leads = useMemo(() => {
    if (!allLeads) return [];
    if (!searchTerm) return allLeads;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(lowercasedFilter) ||
        lead.email.toLowerCase().includes(lowercasedFilter) ||
        lead.property.toLowerCase().includes(lowercasedFilter)
    );
  }, [allLeads, searchTerm]);


  const handleCreateLead = async (newLeadData: Omit<Lead, 'id' | 'ownerId'>) => {
    if (!firestore || !user?.uid) return;
    const newLeadWithId = { ...newLeadData, id: crypto.randomUUID(), ownerId: user.uid };
    try {
        add(newLeadWithId as Lead); // Optimistic update
        await createLead(firestore, user.uid, newLeadWithId);
    } catch (e) {
        console.error("Failed to create lead", e);
        toast({
            title: 'Error creating lead',
            description: 'Could not save the new lead to the database.',
            variant: 'destructive'
        });
        remove(newLeadWithId.id); // Rollback optimistic update
    }
  }

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = (isChecked: boolean | 'indeterminate') => {
    if (isChecked === true && leads) {
      setSelectedLeads(leads.map((l) => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleUpdateLead = async (leadId: string, updates: Partial<Lead>) => {
    if (!firestore || !user?.uid) return;
    update(leadId, updates);
    await updateLead(firestore, user.uid, leadId, updates);
  };

  const handleUpdateSelectedLeads = async (updates: Partial<Lead>) => {
    if (!firestore || !user?.uid || selectedLeads.length === 0) return;
    selectedLeads.forEach((id) => update(id, updates));
    await updateLeads(firestore, user.uid, selectedLeads, updates);
    toast({
      title: `${Object.keys(updates)[0]} Updated`,
      description: `Updated ${selectedLeads.length} leads.`,
    });
    setSelectedLeads([]);
  };

  const handleDeleteSelected = async () => {
    if (!firestore || !user?.uid || selectedLeads.length === 0) return;
    const leadsToDelete = [...selectedLeads];
    
    // Optimistic UI update
    leadsToDelete.forEach((id) => remove(id));
    setDeleteDialogOpen(false);
    setSelectedLeads([]);

    try {
      await deleteLeads(firestore, user.uid, leadsToDelete);
      toast({
        title: 'Leads Deleted',
        description: `Successfully deleted ${leadsToDelete.length} leads.`,
      });
    } catch (error) {
      toast({
        title: 'Error Deleting Leads',
        description: 'Could not delete leads. They have been restored.',
        variant: 'destructive',
      });
      // Re-add the leads if the delete fails (rollback)
      const originalLeads = allLeads?.filter(l => leadsToDelete.includes(l.id)) || [];
      originalLeads.forEach(l => add(l));
    }
  };

  const handleCellUpdate = async (
    leadId: string,
    field: keyof Lead,
    value: string
  ) => {
    if (!firestore || !user?.uid) return;
    try {
      update(leadId, { [field]: value });
      await updateLead(firestore, user.uid, leadId, { [field]: value });
      toast({
        title: 'Lead Updated',
        description: `Set ${field} to "${value}"`,
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Could not update lead.',
        variant: 'destructive',
      });
    }
    setEditingCell(null);
  };

  const isAllSelected =
    leads && leads.length > 0 && selectedLeads.length === leads.length;
  const isSomeSelected =
    selectedLeads.length > 0 && (!leads || selectedLeads.length < leads.length);

  const renderSkeletons = () =>
    Array.from({ length: 10 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-40" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-20 rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-8" />
        </TableCell>
      </TableRow>
    ));

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Breadcrumbs path={[{ name: "Courses", href: "/courses" }, { name: "Leads", href: "/leads" }]} />
            <h2 className="text-2xl font-bold font-headline tracking-tight mt-2">
              Lead Management
            </h2>
            <p className="text-muted-foreground">
              Track and manage all incoming leads for your listings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={'Search leads...'}
                className="w-full rounded-lg bg-background pl-8 md:w-[250px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className='flex items-center gap-2'>
                <CardTitle className="font-headline text-lg">
                  All Leads
                </CardTitle>
                <CreateLeadDialog onAdd={handleCreateLead} />
              </div>
              {selectedLeads.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedLeads.length} selected
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Actions <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Change Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {statusOptions.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onSelect={() =>
                                  handleUpdateSelectedLeads({ status })
                                }
                              >
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Change Priority
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {priorityOptions.map((priority) => (
                              <DropdownMenuItem
                                key={priority}
                                onSelect={() =>
                                  handleUpdateSelectedLeads({ priority })
                                }
                              >
                                {priority}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onSelect={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
             <CardDescription className="text-muted-foreground text-sm mt-1">
                {leads ? `${leads.length} leads found.` : 'Loading leads...'}
              </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={
                          isAllSelected ||
                          (isSomeSelected ? 'indeterminate' : false)
                        }
                        onCheckedChange={(checked) => handleSelectAll(checked)}
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
                  {isLoading || !leads
                    ? renderSkeletons()
                    : leads.length > 0 ? leads.map((lead) => {
                        const isEditingName = editingCell === `${lead.id}-name`;
                        const isEditingProperty =
                          editingCell === `${lead.id}-property`;
                        const isEditingDate =
                          editingCell === `${lead.id}-lastContacted`;
                        return (
                          <TableRow
                            key={lead.id}
                            data-state={
                              selectedLeads.includes(lead.id) ? 'selected' : undefined
                            }
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedLeads.includes(lead.id)}
                                onCheckedChange={() => handleSelectLead(lead.id)}
                                aria-label={`Select lead ${lead.name}`}
                              />
                            </TableCell>
                            <TableCell
                              className="font-medium"
                              onDoubleClick={() =>
                                setEditingCell(`${lead.id}-name`)
                              }
                            >
                              {isEditingName ? (
                                <Input
                                  defaultValue={lead.name}
                                  onBlur={(e) =>
                                    handleCellUpdate(
                                      lead.id,
                                      'name',
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleCellUpdate(
                                        lead.id,
                                        'name',
                                        e.currentTarget.value
                                      );
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  autoFocus
                                  className="h-8"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  {lead.name}
                                </div>
                              )}
                            </TableCell>
                            <TableCell
                              onDoubleClick={() =>
                                setEditingCell(`${lead.id}-property`)
                              }
                            >
                              {isEditingProperty ? (
                                <Input
                                  defaultValue={lead.property}
                                  onBlur={(e) =>
                                    handleCellUpdate(
                                      lead.id,
                                      'property',
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleCellUpdate(
                                        lead.id,
                                        'property',
                                        e.currentTarget.value
                                      );
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  autoFocus
                                  className="h-8"
                                />
                              ) : (
                                lead.property
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'border cursor-pointer',
                                      statusColors[lead.status]
                                    )}
                                  >
                                    {lead.status}
                                  </Badge>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  {statusOptions.map((status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onSelect={() =>
                                        handleUpdateLead(lead.id, { status })
                                      }
                                    >
                                      <div
                                        className={cn(
                                          'w-2 h-2 rounded-full mr-2',
                                          statusColors[status]
                                        )}
                                      ></div>
                                      {status}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <span
                                    className={cn(
                                      'font-medium cursor-pointer flex items-center gap-2',
                                      priorityUIMap[lead.priority]?.color
                                    )}
                                  >
                                    {
                                      priorityUIMap[lead.priority]?.display
                                    }
                                  </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  {priorityOptions.map((priority) => (
                                    <DropdownMenuItem
                                      key={priority}
                                      onSelect={() =>
                                        handleUpdateLead(lead.id, { priority })
                                      }
                                    >
                                      <div
                                        className={cn(
                                          'w-2 h-2 rounded-full mr-2',
                                          priorityUIMap[
                                            priority as keyof typeof priorityUIMap
                                          ]?.color.replace('text-', 'bg-')
                                        )}
                                      ></div>
                                      {
                                        priorityUIMap[
                                          priority as keyof typeof priorityUIMap
                                        ]?.display
                                      }
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell
                              onDoubleClick={() =>
                                setEditingCell(`${lead.id}-lastContacted`)
                              }
                            >
                              {isEditingDate ? (
                                <Input
                                  type="date"
                                  defaultValue={lead.lastContacted}
                                  onBlur={(e) =>
                                    handleCellUpdate(
                                      lead.id,
                                      'lastContacted',
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleCellUpdate(
                                        lead.id,
                                        'lastContacted',
                                        e.currentTarget.value
                                      );
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  autoFocus
                                  className="h-8"
                                />
                              ) : (
                                lead.lastContacted
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onSelect={() => {
                                      setSelectedLeads([lead.id]);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Lead
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No leads found. Click the '+' button to add your first lead.
                          </TableCell>
                        </TableRow>
                      )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected {selectedLeads.length} lead(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: 'destructive' }))}
              onClick={handleDeleteSelected}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


export default function LeadsPage() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background">
                <CoursesSidebar />
                <SidebarInset>
                    <Header showSidebarTrigger={true} />
                    <ScrollArea className="h-[calc(100vh-4rem)]">
                        <main className="flex-1 p-4 md:p-6">
                            <LeadsComponent />
                        </main>
                    </ScrollArea>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
