import {
  createContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { ITask, TaskFilter } from "../types/ITask";
import { taskReducer } from "../reducers/taskReducer";
import { initialTasks } from "../data/initialTasks";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ITaskContextType {
  tasks: ITask[];
  currentFilter: TaskFilter;
  editingTask: ITask | null;
  setEditingTask: (task: ITask | null) => void;
  setFilter: (filter: TaskFilter) => void;
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
  const [currentFilter, setCurrentFulter] = useLocalStorage<TaskFilter>(
    "task_filter",
    "all",
  );
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

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
};
