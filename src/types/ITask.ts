import type { TaskCategory } from "./TaskCategory";
import type { TaskPriorityType } from "./TaskPriority";

export interface ITask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: TaskPriorityType;
  category: TaskCategory;
}
