'use client';

import React from 'react';
import type { Task } from '@/types/blitzit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Mic, PlayCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskDetailsProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function TaskDetails({ task, isOpen, setIsOpen }: TaskDetailsProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    task.scheduledAt ? new Date(task.scheduledAt) : undefined
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            Edit task details or start a focus session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" defaultValue={task.title} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" defaultValue={task.description} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue={task.priority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="neither">Neither</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
               <Select defaultValue={task.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="do-now">Do Now</SelectItem>
                  <SelectItem value="do-later">Do Later</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="soon">Soon</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Schedule Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="estimatedTime">Estimated Time (min)</Label>
                    <Input id="estimatedTime" type="number" defaultValue={task.estimatedTime} />
                </div>
           </div>
           <div className="grid gap-2">
                <Label>Voice Notes</Label>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                    <Button variant="ghost" size="icon"><Mic className="h-5 w-5"/></Button>
                    <div className="w-full h-1 bg-background rounded-full" />
                    <span className="text-xs text-muted-foreground">00:00</span>
                </div>
           </div>
        </div>
        <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
            <Button variant="primary" className="bg-green-500 hover:bg-green-600">
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Focus
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}