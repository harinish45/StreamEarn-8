
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
import { Calendar as CalendarIcon, Mic, PlayCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskDetailsProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onStartFocus: (task: Task) => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetails({ task, isOpen, setIsOpen, onStartFocus, onSave, onDelete }: TaskDetailsProps) {
  const [editedTask, setEditedTask] = React.useState<Task>(task);

  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    onSave(editedTask);
    setIsOpen(false);
  };

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({...prev, [field]: value}));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details or start a focus session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={editedTask.title} onChange={(e) => handleChange('title', e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={editedTask.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={editedTask.priority} onValueChange={(value) => handleChange('priority', value)}>
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
               <Select value={editedTask.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="do-now">Do Now</SelectItem>
                  <SelectItem value="do-later">Do Later</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="soon">Soon</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
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
                            !editedTask.scheduledAt && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editedTask.scheduledAt ? format(new Date(editedTask.scheduledAt), "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={editedTask.scheduledAt ? new Date(editedTask.scheduledAt) : undefined}
                            onSelect={(date) => handleChange('scheduledAt', date?.getTime())}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="estimatedTime">Estimated Time (min)</Label>
                    <Input id="estimatedTime" type="number" value={editedTask.estimatedTime || ''} onChange={(e) => handleChange('estimatedTime', parseInt(e.target.value) || 0)} />
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
        <DialogFooter className="justify-between">
            <div>
                 <Button variant="destructive" size="icon" onClick={() => onDelete(task.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button onClick={() => onStartFocus(task)} className="bg-gradient-to-r from-primary to-secondary text-white">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Focus
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
