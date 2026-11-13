import { TaskItem } from "./TaskItem";
import type { ITask, TaskFilter } from "../types/ITask";

interface TaskListProps {
  tasks: ITask[];
  currentFilter: TaskFilter;
  onToggle: (task: ITask) => void;
  onEdit: (task: ITask) => void;
  onView: (task: ITask) => void;
  onDelete: (task: ITask) => void;
}

export const TaskList = ({
  tasks,
  currentFilter,
  onToggle,
  onEdit,
  onView,
  onDelete,
}: TaskListProps) => {
  let filteredTasks;
  switch (currentFilter) {
    case "active":
      filteredTasks = tasks.filter((t) => !t.completed);
      break;
    case "completed":
      filteredTasks = tasks.filter((t) => t.completed);
      break;
    default:
      filteredTasks = tasks;
  }
  const totalTaskCount = tasks.length;
  if (filteredTasks.length === 0) {
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
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
