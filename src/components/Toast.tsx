import { useTaskContext } from "../hooks/useTaskContext";

export const Toast = () => {
  const { tasks, undoDelete } = useTaskContext();
  const pendingTasks = tasks.filter((task) => task.isPendingDelete === true);

  if (pendingTasks.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 sm:left-auto sm:w-96"
    >
      {pendingTasks.map((task) => (
        <div
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
          key={task.id}
          role="status"
        >
          <p className="min-w-0 text-sm text-slate-700">
            <span className="font-medium">Завдання видаляється:</span>{" "}
            <span className="wrap-break-word">{task.title}</span>
          </p>
          <button
            aria-label={`Скасувати видалення «${task.title}»`}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => undoDelete(task.id)}
            type="button"
          >
            Скасувати
          </button>
          <div className="origin-left animate-[shrink_5000ms_linear_forwards] bg-indigo-600" />
        </div>
      ))}
    </div>
  );
};
