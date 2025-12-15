
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { produce } from 'immer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Plus, Trash2, X, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// --- Types ---
type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type List = {
  _id: string;
  name: string;
  tasks: Task[];
};

// --- Components ---

function TaskItem({ task, onToggle, onDelete, id }: { task: Task; onToggle: () => void; onDelete: () => void; id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg shadow-sm"
    >
      <button {...attributes} {...listeners} className="cursor-grab touch-none">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={onToggle} />
      <label
        htmlFor={`task-${task.id}`}
        className={`flex-1 text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
      >
        {task.text}
      </label>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
    fetch('/api/lists')
      .then(res => res.json())
      .then(data => {
        setLists(data);
        if (data.length > 0 && !selectedListId) {
          setSelectedListId(data[0]._id);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch lists", err);
        toast({ variant: "destructive", title: "Failed to load lists" });
        setIsLoading(false);
      });
  }, [toast, selectedListId]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedList = useMemo(
    () => lists.find((list) => list._id === selectedListId),
    [lists, selectedListId]
  );
  
  const updateListInDb = useCallback(async (listId: string, updatedList: Partial<Omit<List, '_id'>>) => {
    try {
        const response = await fetch(`/api/lists/${listId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        if (!response.ok) throw new Error('Failed to update list');
        const data = await response.json();
        setLists(currentLists => currentLists.map(l => l._id === listId ? data : l));
    } catch (error) {
        toast({ variant: "destructive", title: "Failed to update list" });
        console.error(error);
        // Consider rolling back optimistic updates here if you have them.
    }
  }, [toast]);


  const handleAddList = async () => {
    if (newListName.trim()) {
      const optimisticNewList: List = {
        _id: `temp-${Date.now()}`,
        name: newListName.trim(),
        tasks: [],
      };
      
      const prevLists = lists;
      setLists([...lists, optimisticNewList]);
      setSelectedListId(optimisticNewList._id);
      setNewListName('');

      try {
        const response = await fetch('/api/lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newListName.trim(), tasks: [] }),
        });

        if (!response.ok) throw new Error('Failed to add list');
        const newList = await response.json();
        
        setLists(currentLists => {
          const newLists = currentLists.map(l => l._id === optimisticNewList._id ? newList : l);
          return newLists;
        });
        setSelectedListId(newList._id);

      } catch (error) {
        toast({ variant: "destructive", title: "Failed to add list" });
        setLists(prevLists);
      }
    }
  };

  const handleAddTask = async () => {
    if (newTaskText.trim() && selectedListId && selectedList) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        text: newTaskText.trim(),
        completed: false,
      };

      const updatedTasks = [...selectedList.tasks, newTask];
      
      const prevLists = lists;
      setLists(
        produce((draft) => {
          const list = draft.find((l) => l._id === selectedListId);
          if (list) {
            list.tasks.push(newTask);
          }
        })
      );
      setNewTaskText('');

      try {
        await updateListInDb(selectedListId, { tasks: updatedTasks });
      } catch {
        setLists(prevLists);
      }
    }
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedList) return;
    
    const updatedTasks = produce(selectedList.tasks, draft => {
        const task = draft.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
    });

    setLists(lists.map(l => l._id === selectedListId ? { ...l, tasks: updatedTasks } : l));
    updateListInDb(selectedListId, { tasks: updatedTasks });
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (!selectedList) return;

    const updatedTasks = selectedList.tasks.filter((t) => t.id !== taskId);
    setLists(lists.map(l => l._id === selectedListId ? { ...l, tasks: updatedTasks } : l));
    updateListInDb(selectedListId, { tasks: updatedTasks });
  };

  const handleDeleteList = async (listId: string) => {
    const originalLists = lists;
    setLists(lists.filter(l => l._id !== listId));
    if(selectedListId === listId) {
        const remainingLists = originalLists.filter(l => l._id !== listId);
        setSelectedListId(remainingLists[0]?._id || null);
    }
    try {
      const response = await fetch(`/api/lists/${listId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete list');
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete list" });
      setLists(originalLists);
    }
  };
  
  const handleStartEditingList = (list: List) => {
    setEditingListId(list._id);
    setEditingListName(list.name);
  };
  
  const handleUpdateList = () => {
      if(editingListId && editingListName.trim()) {
          updateListInDb(editingListId, { name: editingListName.trim() });
          setEditingListId(null);
          setEditingListName('');
      }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (active.id !== over?.id && selectedListId && selectedList) {
        const oldIndex = selectedList.tasks.findIndex(t => t.id === active.id);
        const newIndex = selectedList.tasks.findIndex(t => t.id === over?.id);

        if (oldIndex === -1 || newIndex === -1) return;
        
        const newTasks = arrayMove(selectedList.tasks, oldIndex, newIndex);

        setLists(lists.map(l => l._id === selectedListId ? { ...l, tasks: newTasks } : l));
        updateListInDb(selectedListId, { tasks: newTasks });
    }
  };

  const SidebarSkeleton = () => (
    <aside className="w-64 flex flex-col border-r border-border p-4">
      <Skeleton className="h-8 w-2/4 mb-4" />
      <div className="flex-1 space-y-2 overflow-y-auto">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </aside>
  );

  const MainContentSkeleton = () => (
     <main className="flex-1 flex flex-col p-6">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
        </div>
        <div className="mt-6 flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
        </div>
     </main>
  );

  if (isLoading || !isClient) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <SidebarSkeleton />
            <MainContentSkeleton />
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-border p-4">
        <h2 className="text-xl font-bold mb-4">My Lists</h2>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {lists.map((list) => (
            <div
              key={list._id}
              className={`group flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedListId === list._id ? 'bg-primary/20 text-primary' : 'hover:bg-accent'}`}
              onClick={() => setSelectedListId(list._id)}
            >
              {editingListId === list._id ? (
                  <div className="flex-1 flex gap-2">
                    <Input 
                        value={editingListName}
                        onChange={(e) => setEditingListName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateList()}
                        className="h-8"
                        autoFocus
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUpdateList}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingListId(null)}><X className="h-4 w-4" /></Button>
                  </div>
              ) : (
                <>
                    <span className="flex-1 truncate">{list.name}</span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => {e.stopPropagation(); handleStartEditingList(list);}}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => {e.stopPropagation(); handleDeleteList(list._id);}}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="New list name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
          />
          <Button onClick={handleAddList} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        {selectedList ? (
          <>
            <h1 className="text-3xl font-bold mb-6">{selectedList.name}</h1>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext 
                        items={selectedList.tasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {selectedList.tasks.map((task) => (
                            <TaskItem 
                                key={task.id}
                                id={task.id}
                                task={task} 
                                onToggle={() => handleToggleTask(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
            <div className="mt-6 flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">No list selected</h2>
              <p className="text-muted-foreground mt-2">Create or select a list to get started.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
