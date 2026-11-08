import {
  createContext,
} from "react";
import type { ITask, TaskFilter } from "../types/ITask";

interface ITaskContextType {
  tasks: ITask[];
  currentFilter: TaskFilter;
  editingTask: ITask | null;
  setEditingTask: (task: ITask | null) => void;
  setCurrentFilter: (filter: TaskFilter) => void;
  addTask: (taskData: Omit<ITask, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
  updateTask: (task: ITask) => void;
  requestDelete: (id: string) => void;
  undoDelete: (id: string) => void;
  requestClearCompleted: () => void;
  undoClearCompleted: () => void;
  resetTasks: () => void;
}

export const TaskContext = createContext<ITaskContextType | null>(null);

