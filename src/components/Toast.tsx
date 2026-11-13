import { useTaskContext } from "../hooks/useTaskContext";
import type { ToastType } from "../types/IToast";

const toastStyles: Record<
  ToastType,
  { label: string; border: string; progressBar: string }
> = {
  info: {
    label: "Інформація",
    border: "border-blue-200",
    progressBar: "bg-indigo-600",
  },
  error: {
    label: "Помилка",
    border: "border-red-200",
    progressBar: "bg-red-600",
  },
  success: {
    label: "Успіх",
    border: "border-green-200",
    progressBar: "bg-green-600",
  },
};

export const Toast = () => {
  const { toasts, hideToast } = useTaskContext();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 sm:left-auto sm:w-96"
    >
      {toasts.map((toast) => (
        <div
          className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border bg-white p-4 shadow-lg ${toastStyles[toast.type].border}`}
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <div className="min-w-0 text-sm text-slate-700">
            <p className="font-medium">{toastStyles[toast.type].label}</p>
            <p className="wrap-break-word">{toast.message}</p>
          </div>
          <button
            aria-label="Закрити сповіщення"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => hideToast(toast.id)}
            type="button"
          >
            Закрити
          </button>
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 h-1 origin-left animate-[toast-shrink_5000ms_linear_forwards] ${toastStyles[toast.type].progressBar}`}
          />
        </div>
      ))}
    </div>
  );
};
