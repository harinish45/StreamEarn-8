'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, GripVertical, Trash2, Edit, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Types ---

type Task = {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
};

type List = {
  id: string;
  title: string;
};

// --- Initial Data ---

const initialLists: List[] = [
  { id: 'list-1', title: 'Work' },
  { id: 'list-2', title: 'Personal' },
  { id: 'list-3', title: 'Groceries' },
];

const initialTasks: Task[] = [
  { id: 'task-1', listId: 'list-1', title: 'Finish report for Q2', completed: false },
  { id: 'task-2', listId: 'list-1', title: 'Prepare presentation slides', completed: false },
  { id: 'task-3', listId: 'list-2', title: 'Call the dentist', completed: true },
  { id: 'task-4', listId: 'list-3', title: 'Milk', completed: false },
  { id: 'task-5', listId: 'list-3', title: 'Bread', completed: false },
];

// --- Sortable Task Item Component ---

function SortableTaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-card p-3 rounded-md border border-border"
    >
      <div {...attributes} {...listeners} className="cursor-grab touch-none p-1">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      />
      <label
        htmlFor={`task-${task.id}`}
        className={`flex-1 text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
      >
        {task.title}
      </label>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(task.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// --- List Sidebar Component ---

function ListSidebar({
  lists,
  activeList,
  onListChange,
  onAddList,
  onEditList,
  onDeleteList,
}: {
  lists: List[];
  activeList: List | null;
  onListChange: (id: string) => void;
  onAddList: (title: string) => void;
  onEditList: (id: string, newTitle: string) => void;
  onDeleteList: (id: string) => void;
}) {
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState<List | null>(null);
  const [editingListName, setEditingListName] = useState('');

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
    }
  };
  
  const handleStartEdit = (list: List) => {
    setEditingList(list);
    setEditingListName(list.title);
  };

  const handleSaveEdit = () => {
    if (editingList && editingListName.trim()) {
      onEditList(editingList.id, editingListName.trim());
    }
    setEditingList(null);
    setEditingListName('');
  };

  return (
    <div className="h-screen w-64 border-r bg-background flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold tracking-tight">Lists</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        <nav className="grid gap-1">
          {lists.map((list) => (
            <div key={list.id} className="group flex items-center">
              <Button
                variant={activeList?.id === list.id ? 'secondary' : 'ghost'}
                className="flex-1 justify-start"
                onClick={() => onListChange(list.id)}
              >
                {list.title}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleStartEdit(list)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100" onClick={() => onDeleteList(list.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleAddList}>
          <div className="flex gap-2">
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name..."
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      {editingList && (
        <Dialog open={!!editingList} onOpenChange={() => setEditingList(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit List Name</DialogTitle>
            </DialogHeader>
            <Input 
              value={editingListName}
              onChange={(e) => setEditingListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingList(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// --- Task List Component ---

function TaskList({
  list,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: {
  list: List;
  tasks: Task[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  return (
    <div className="p-4 md:p-6 flex-1 flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{list.title}</h1>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <SortableTaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />
        ))}
      </div>
      <div className="mt-4">
        <form onSubmit={handleAddTask}>
          <div className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Dashboard Page ---

export default function DashboardPage() {
  const [lists, setLists] = useState<List[]>(initialLists);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeListId, setActiveListId] = useState<string | null>(initialLists[0]?.id || null);
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeList = useMemo(() => lists.find((l) => l.id === activeListId), [lists, activeListId]);
  const activeListTasks = useMemo(() => tasks.filter((t) => t.listId === activeListId), [tasks, activeListId]);

  const handleAddList = (title: string) => {
    const newList: List = {
      id: `list-${Date.now()}`,
      title,
    };
    setLists((prev) => [...prev, newList]);
    setActiveListId(newList.id);
  };
  
  const handleEditList = (id: string, newTitle: string) => {
    setLists(lists => lists.map(l => l.id === id ? {...l, title: newTitle} : l))
  }

  const handleDeleteList = (id: string) => {
    if (confirm('Are you sure you want to delete this list and all its tasks?')) {
      setLists(lists => lists.filter(l => l.id !== id));
      setTasks(tasks => tasks.filter(t => t.listId !== id));
      if (activeListId === id) {
        setActiveListId(lists[0]?.id || null);
      }
    }
  }

  const handleAddTask = (title: string) => {
    if (!activeListId) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      listId: activeListId,
      title,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if(task) {
        setActiveDragTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragTask(null);
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        if (oldIndex === -1 || newIndex === -1) return items;

        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        
        return newItems;
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <ListSidebar
        lists={lists}
        activeList={activeList || null}
        onListChange={setActiveListId}
        onAddList={handleAddList}
        onEditList={handleEditList}
        onDeleteList={handleDeleteList}
      />
      <main className="flex-1 flex flex-col">
        {activeList ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={activeListTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <TaskList
                list={activeList}
                tasks={activeListTasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </SortableContext>
            <DragOverlay>
                {activeDragTask ? <SortableTaskItem task={activeDragTask} onToggle={()=>{}} onDelete={()=>{}} /> : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">No list selected</h2>
              <p className="text-muted-foreground">Create or select a list to get started.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
