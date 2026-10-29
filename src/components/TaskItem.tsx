import type { ITask } from "../types/ITask";

interface ITaskItemProps {
  task: ITask;
  onToggle(): void;
  onDelete(): void;
}

const priorityLabels = {
  low: "Низький",
  medium: "Середній",
  high: "Високий",
} as const;

const categoryLabels = {
  Study: "Навчання",
  Home: "Дім",
  Work: "Робота",
  Misc: "Інше",
} as const;

const priorityClassNames = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
} as const;

export const TaskItem = ({ task, onToggle, onDelete }: ITaskItemProps) => (
  <li
    className={`rounded-2xl border p-4 shadow-sm transition sm:p-5 ${
      task.completed
        ? "border-emerald-200 bg-emerald-50/70"
        : "border-slate-200 bg-white"
    }`}
  >
    <div className="flex items-start gap-3">
      <input
        aria-label={
          task.completed
            ? `Позначити «${task.title}» невиконаним`
            : `Позначити «${task.title}» виконаним`
        }
        checked={task.completed}
        className="mt-1 size-5 shrink-0 accent-indigo-600"
        onChange={onToggle}
        type="checkbox"
      />
      <div className="min-w-0 flex-1">
        <h3
          className={`break-words font-semibold ${
            task.completed
              ? "text-slate-500 line-through"
              : "text-slate-900"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">
            {task.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {categoryLabels[task.category]}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityClassNames[task.priority]}`}
          >
            Пріоритет: {priorityLabels[task.priority]}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {task.completed ? "Виконано" : "До виконання"}
          </span>
        </div>
      </div>
      <button
        aria-label={`Видалити «${task.title}»`}
        className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        onClick={onDelete}
        type="button"
      >
        Видалити
      </button>
    </div>
  </li>
);
