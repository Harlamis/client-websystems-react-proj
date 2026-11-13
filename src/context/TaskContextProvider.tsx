import { useState, type ReactNode } from "react";
import { TaskContext } from "./TaskContext";
import type { ITask, TaskFilter } from "../types/ITask";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { IToast, ToastType } from "../types/IToast";

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentFilter, setCurrentFilter] = useLocalStorage<TaskFilter>(
    "task_filter",
    "all",
  );
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const [toasts, setToasts] = useState<IToast[]>([]);

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message: string, type: ToastType = "info") => {
    const newToast: IToast = {
      id: crypto.randomUUID(),
      message,
      type,
    };
    setToasts((prev) => [newToast, ...prev]);
    setTimeout(() => hideToast(newToast.id), 5000);
  };

  const value = {
    toasts,
    hideToast,
    showToast,
    currentFilter,
    setCurrentFilter,
    editingTask,
    setEditingTask,
  };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
