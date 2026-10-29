import type { ITask } from "../types/ITask";
import { TaskItem } from "./TaskItem";

export interface ITaskListProps {
  tasks: ITask[];
  totalTaskCount: number;
  onToggleTask(id: string): void;
  onDeleteTask(id: string): void;
}

export const TaskList = ({
  tasks,
  totalTaskCount,
  onToggleTask,
  onDeleteTask,
}: ITaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-800">
          {totalTaskCount === 0
            ? "Завдань поки немає."
            : "За цим фільтром завдань немає."}
        </p>
        {totalTaskCount === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            Додайте перше навчальне завдання.
          </p>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
    </ul>
  );
};