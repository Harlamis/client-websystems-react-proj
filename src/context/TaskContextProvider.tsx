import { useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { TaskContext } from "./TaskContext";
import type { ITask, TaskFilter } from "../types/ITask";
import { taskReducer } from "../reducers/taskReducer";
import { initialTasks } from "../data/initialTasks";
import { useLocalStorage } from "../hooks/useLocalStorage";

const initTasks = (defaultTasks: ITask[]) => {
  try {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  } catch (error) {
    console.error("Error loading tasks from local storage", error);
    return defaultTasks;
  }
};

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks, initTasks);
  const [currentFilter, setCurrentFilter] = useLocalStorage<TaskFilter>(
    "task_filter",
    "all",
  );
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const deleteTimersRef = useRef<Record<string, number>>({});
  const clearCompletedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error while saving tasks to local storage", error);
    }
  }, [tasks]);

  useEffect(() => {
    const activeTasks = tasks.filter(
      (task) => task.completed === false && task.isPendingDelete !== true,
    ).length;
    document.title = `Study Planner - ${activeTasks} active tasks`;
  }, [tasks]);

  const addTask = (taskData: Omit<ITask, "id" | "completed">) => {
    const newTask: ITask = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const toggleTask = (id: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: { id: id } });
  };

  const requestDelete = (id: string) => {
    window.clearTimeout(deleteTimersRef.current[id]);
    dispatch({ type: "REQUEST_DELETE", payload: { id: id } });
    const timerId = window.setTimeout(() => {
      dispatch({ type: "CONFIRM_DELETE", payload: { id: id } });
      delete deleteTimersRef.current[id];
    }, 5000);
    deleteTimersRef.current[id] = timerId;
  };

  const updateTask = (task: ITask) => {
    dispatch({ type: "UPDATE_TASK", payload: task });
    setEditingTask(null);
  };

  const undoDelete = (id: string) => {
    window.clearTimeout(deleteTimersRef.current[id]);
    delete deleteTimersRef.current[id];
    dispatch({ type: "UNDO_DELETE", payload: { id: id } });
  };

  const requestClearCompleted = () => {
    if (clearCompletedTimerRef.current) {
      window.clearTimeout(clearCompletedTimerRef.current);
    }
    dispatch({ type: "REQUEST_CLEAR_COMPLETED" });
    clearCompletedTimerRef.current = window.setTimeout(() => {
      dispatch({ type: "CONFIRM_CLEAR_COMPLETED" });
      clearCompletedTimerRef.current = null;
    }, 5000);
  };

  const undoClearCompleted = () => {
    if (clearCompletedTimerRef.current) {
      window.clearTimeout(clearCompletedTimerRef.current);
      clearCompletedTimerRef.current = null;
    }
    dispatch({ type: "UNDO_CLEAR_COMPLETED" });
  };

  const resetTasks = () => {
    dispatch({ type: "RESET_TASKS", payload: initialTasks });
  };

  const value = {
    tasks,
    currentFilter,
    setCurrentFilter,
    editingTask,
    setEditingTask,
    addTask,
    toggleTask,
    updateTask,
    undoDelete,
    undoClearCompleted,
    requestClearCompleted,
    requestDelete,
    resetTasks,
  };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
