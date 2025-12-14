
export interface UserProfile {
  displayName: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export type TaskStatus = 'do-now' | 'do-later' | 'tomorrow' | 'soon' | 'done' | 'archived';
export type TaskPriority = 'urgent' | 'important' | 'neither';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  listId: string;
  scheduledAt?: number; // timestamp
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  notes?: string;
  tags?: string[];
  recurring?: 'daily' | 'weekly' | 'monthly' | null;
  subtasks?: Subtask[];
  audioBlob?: Blob;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: number; // timestamp
}

export interface FocusSession {
  id: string;
  taskId: string;
  startTime: number; // timestamp
  endTime: number; // timestamp
  duration: number; // in minutes
}

export interface Report {
  id: string;
  date: number; // timestamp
  tasksCompleted: number;
  timeSpent: number; // in minutes
  categories: Record<string, number>;
}

export interface GamificationStats {
  streaks: {
    day: number;
    week: number;
    month: number;
  };
  level: number;
  badges: string[];
  totalTasksCompleted: number;
}
