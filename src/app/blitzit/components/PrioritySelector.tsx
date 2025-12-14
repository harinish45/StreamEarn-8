
'use client';

import React from 'react';
import type { TaskPriority } from '@/types/blitzit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const priorities: TaskPriority[] = ['urgent', 'important', 'neither'];

const priorityMap: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  urgent: { label: 'Urgent', className: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
  important: { label: 'Important', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  neither: { label: 'Neither', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
};

interface PrioritySelectorProps {
  currentPriority: TaskPriority;
  onPriorityChange: (newPriority: TaskPriority) => void;
}

export function PrioritySelector({ currentPriority, onPriorityChange }: PrioritySelectorProps) {
  const { label, className } = priorityMap[currentPriority];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex h-6 items-center justify-center rounded-full px-2 text-xs font-semibold cursor-pointer transition-colors hover:border-primary/80 ${className}`}
        >
          {label}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {priorities.map((priority) => (
          <DropdownMenuItem
            key={priority}
            onSelect={() => onPriorityChange(priority)}
            className={priority === currentPriority ? 'bg-accent' : ''}
          >
            <div className='flex items-center gap-2'>
              <div className={`h-3 w-3 rounded-full ${priorityMap[priority].className.split(' ')[0]}`}></div>
              <span>{priorityMap[priority].label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
