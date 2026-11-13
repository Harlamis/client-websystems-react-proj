import type { ITask } from "../types/ITask";

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

interface TaskItemProps {
  task: ITask;
  onToggle: (task: ITask) => void;
  onEdit: (task: ITask) => void;
  onView: (task: ITask) => void;
  onDelete: (task: ITask) => void;
}

export const TaskItem = ({
  task,
  onToggle,
  onEdit,
  onView,
  onDelete,
}: TaskItemProps) => {
  return (
    <li
      className={`rounded-2xl border p-4 shadow-sm transition sm:p-5 ${
        task.completed
          ? "border-emerald-200 bg-emerald-50/70"
          : "border-slate-200 bg-white"
      }${
        task.isPendingDelete
          ? "pointer-events-none opacity-40 transition-all duration-300"
          : ""
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
          onChange={() => onToggle(task)}
          type="checkbox"
        />
        <div className="min-w-0 flex-1">
          <h3
            className={`font-semibold wrap-break-word ${
              task.completed ? "text-slate-500 line-through" : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm wrap-break-word whitespace-pre-wrap text-slate-600">
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
        <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
          <button
            aria-label={`Переглянути «${task.title}»`}
            className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => onView(task)}
            type="button"
          >
            Деталі
          </button>
          <button
            aria-label={`Редагувати «${task.title}»`}
            className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => onEdit(task)}
            type="button"
          >
            Редагувати
          </button>
          <button
            aria-label={`Видалити «${task.title}»`}
            className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            onClick={() => onDelete(task)}
            type="button"
          >
            Видалити
          </button>
        </div>
      </div>
    </li>
  );
};
