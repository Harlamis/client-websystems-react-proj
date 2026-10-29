import type { TaskCategory } from "./TaskCategory";

export type TaskPriority = "low" | "medium" | "high";
export type TaskFilter = "all" | "completed" | "active";

export interface ITask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
}
