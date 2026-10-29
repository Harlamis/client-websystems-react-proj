import type { ITask, TaskFilter } from "../types/ITask";

interface ITaskFiltersProps {
  activeFilter: TaskFilter;
  onFilterChange(filter: TaskFilter): void;
  tasks: ITask[];
}

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "active", label: "Невиконані" },
  { value: "completed", label: "Виконані" },
];

export const TaskFilters = ({
  activeFilter,
  onFilterChange,
  tasks,
}: ITaskFiltersProps) => {
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    active: tasks.filter((task) => !task.completed).length,
  };

  return (
    <div
      aria-label="Фільтр завдань"
      className="flex flex-wrap gap-2"
      role="group"
    >
      {filters.map(({ value, label }) => (
        <button
          aria-pressed={activeFilter === value}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            activeFilter === value
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
          }`}
          key={value}
          onClick={() => onFilterChange(value)}
          type="button"
        >
          {label}{" "}
          <span className={activeFilter === value ? "text-indigo-100" : "text-slate-400"}>
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
};
