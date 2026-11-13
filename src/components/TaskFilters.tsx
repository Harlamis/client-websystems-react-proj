import type { ITask, TaskFilter } from "../types/ITask";

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "active", label: "Невиконані" },
  { value: "completed", label: "Виконані" },
];

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  tasks: ITask[];
  onChangeFilter: (filter: TaskFilter) => void;
  onClearCompleted: () => void;
}

export const TaskFilters = ({
  currentFilter,
  tasks,
  onChangeFilter,
  onClearCompleted,
}: TaskFiltersProps) => {
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    active: tasks.filter((task) => !task.completed).length,
  };
  const completedTaskCount = tasks.filter(
    (task) => task.completed && !task.isPendingDelete,
  ).length;

  return (
    <div
      aria-label="Фільтр завдань"
      className="flex flex-wrap gap-2"
      role="group"
    >
      {filters.map(({ value, label }) => (
        <button
          aria-pressed={currentFilter === value}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            currentFilter === value
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-50"
          }`}
          key={value}
          onClick={() => onChangeFilter(value)}
          type="button"
        >
          {label}{" "}
          <span
            className={
              currentFilter === value ? "text-indigo-100" : "text-slate-400"
            }
          >
            {counts[value]}
          </span>
        </button>
      ))}
      {completedTaskCount > 0 && (
        <button
          className="rounded-full px-3 py-1.5 text-sm font-medium text-rose-700 ring-1 ring-rose-200 transition ring-inset hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          onClick={onClearCompleted}
          type="button"
        >
          Очистити виконані
        </button>
      )}
    </div>
  );
};
