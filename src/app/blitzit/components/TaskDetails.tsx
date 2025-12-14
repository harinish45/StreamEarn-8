'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { Calendar as CalendarIcon, Mic, Pause, Play, Square, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PrioritySelector } from './PrioritySelector';

interface TaskDetailsProps {
  task: Task | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetails({ task, isOpen, setIsOpen, onSave, onDelete }: TaskDetailsProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const { toast } = useToast();

  // Voice note state
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setEditedTask(task);
    if (task?.audioBlob) {
        setAudioBlob(task.audioBlob);
        setAudioUrl(URL.createObjectURL(task.audioBlob));
    } else {
        setAudioBlob(null);
        setAudioUrl(null);
    }
  }, [task]);
  
   useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current!.duration);
      };
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audioRef.current.ontimeupdate = () => {
          setCurrentTime(audioRef.current!.currentTime);
      };
    }

    return () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    }
  }, [audioUrl]);

  if (!editedTask) return null;

  const handleSave = () => {
    const taskToSave = {...editedTask};
    if (audioBlob) {
        taskToSave.audioBlob = audioBlob;
    }
    onSave(taskToSave);
    setIsOpen(false);
  };

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => prev ? ({...prev, [field]: value}) : null);
  };
  
  const handleDeleteClick = () => {
      onDelete(editedTask.id);
      setIsOpen(false);
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setCurrentTime(0);
      setDuration(0);
      timerIntervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
      toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description: "Please enable microphone access in your browser settings to record voice notes."
      })
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const deleteAudio = () => {
      setAudioBlob(null);
      setAudioUrl(null);
      setDuration(0);
      setCurrentTime(0);
      if (audioRef.current) {
          audioRef.current.src = '';
      }
      setEditedTask(prev => prev ? ({...prev, audioBlob: undefined }) : null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            Update task details.
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
                    {!audioUrl && !isRecording && (
                        <Button variant="ghost" size="icon" onClick={startRecording}><Mic className="h-5 w-5"/></Button>
                    )}
                    {isRecording && (
                        <Button variant="ghost" size="icon" onClick={stopRecording} className="text-red-500"><Square className="h-5 w-5"/></Button>
                    )}
                    {audioUrl && !isRecording && (
                        <Button variant="ghost" size="icon" onClick={togglePlay}>
                            {isPlaying ? <Pause className="h-5 w-5"/> : <Play className="h-5 w-5"/>}
                        </Button>
                    )}
                    <div className="w-full h-2 bg-background rounded-full relative">
                        <div className="absolute h-full bg-primary rounded-full" style={{ width: `${(currentTime / (duration || 1)) * 100}%`}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTime(isRecording ? duration : (duration || 0) - currentTime)}</span>
                     {audioUrl && !isRecording && (
                        <Button variant="ghost" size="icon" onClick={deleteAudio} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <audio ref={audioRef} className="hidden" />
           </div>
        </div>
        <DialogFooter className="justify-between">
            <div>
                 <Button variant="ghost" size="icon" onClick={handleDeleteClick}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
