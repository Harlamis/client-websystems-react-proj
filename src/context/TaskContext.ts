import { createContext } from "react";
import type { ITask, TaskFilter } from "../types/ITask";
import type { IToast, ToastType } from "../types/IToast";

interface ITaskContextType {
  toasts: IToast[];
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
  currentFilter: TaskFilter;
  editingTask: ITask | null;
  setEditingTask: (task: ITask | null) => void;
  setCurrentFilter: (filter: TaskFilter) => void;
}

export const TaskContext = createContext<ITaskContextType | null>(null);
