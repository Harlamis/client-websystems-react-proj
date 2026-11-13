import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { Toast } from "./components/Toast";
import { Modal } from "./components/Modal";
import { useTasks } from "./hooks/useTasks";
import type { ITask, TaskFilter } from "./types/ITask";
import { useTaskContext } from "./hooks/useTaskContext";

type ActiveModal =
  | { type: "details"; task: ITask }
  | { type: "delete"; task: ITask }
  | { type: "clear-completed"; tasks: ITask[] }
  | null;

const categoryLabels = {
  Study: "Навчання",
  Home: "Дім",
  Work: "Робота",
  Misc: "Інше",
} as const;

const priorityLabels = {
  low: "Низький",
  medium: "Середній",
  high: "Високий",
} as const;

function App() {
  const pageSize = 10;
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isModalBusy, setIsModalBusy] = useState(false);
  const {
    tasks,
    changePage,
    createTask,
    currentPage,
    error,
    total,
    isLoading,
    refetch,
    updateTask,
    deleteTask,
  } = useTasks(pageSize);

  const {
    currentFilter,
    setCurrentFilter,
    setEditingTask,
    showToast,
  } = useTaskContext();

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error && error.message
      ? error.message
      : fallback;

  const handleCreateTask = async (
    task: Omit<ITask, "id" | "completed">,
  ): Promise<boolean> => {
    try {
      const createdTask = await createTask(task);
      showToast(`Завдання «${createdTask.title}» створено.`, "success");
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, "Не вдалося створити завдання"), "error");
      return false;
    }
  };

  const handleUpdateTask = async (task: ITask): Promise<boolean> => {
    try {
      const updatedTask = await updateTask(task, task.id);
      setEditingTask(null);
      showToast(`Завдання «${updatedTask.title}» оновлено.`, "success");
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, "Не вдалося оновити завдання"), "error");
      return false;
    }
  };

  const handleToggleTask = async (task: ITask) => {
    try {
      const updatedTask = await updateTask(
        { completed: !task.completed },
        task.id,
      );
      showToast(
        updatedTask.completed
          ? `Завдання «${updatedTask.title}» виконано.`
          : `Завдання «${updatedTask.title}» повернуто до активних.`,
        "success",
      );
    } catch (error) {
      showToast(getErrorMessage(error, "Не вдалося оновити завдання"), "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (activeModal?.type !== "delete") return;

    try {
      const deletedTask = await deleteTask(activeModal.task.id);
      setActiveModal(null);
      showToast(`Завдання «${deletedTask.title}» видалено.`, "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Не вдалося видалити завдання"), "error");
    } finally {
      setIsModalBusy(false);
    }
  };

  const handleConfirmClearCompleted = async () => {
    if (activeModal?.type !== "clear-completed") return;

    setIsModalBusy(true);
    const tasksToDelete = activeModal.tasks;
    const results = await Promise.allSettled(
      tasksToDelete.map((task) => deleteTask(task.id)),
    );
    const deletedCount = results.filter(
      (result) => result.status === "fulfilled",
    ).length;
    const failedCount = results.length - deletedCount;
    setActiveModal(null);
    setIsModalBusy(false);

    if (failedCount > 0) {
      showToast(
        `Видалено: ${deletedCount}. Не вдалося видалити: ${failedCount}.`,
        "error",
      );
    } else {
      showToast(`Видалено виконаних завдань: ${deletedCount}.`, "success");
    }
  };

  const openClearCompletedConfirmation = () => {
    const completedTasks = tasks.filter((task) => task.completed);
    if (completedTasks.length === 0) return;
    setActiveModal({ type: "clear-completed", tasks: completedTasks });
  };

  const closeModal = () => {
    if (!isModalBusy) setActiveModal(null);
  };

  const handleFilterChange = (filter: TaskFilter) => {
    setCurrentFilter(filter);
  };

  useEffect(() => {
    const activeTasks = tasks.filter(
      (task) => task.completed === false && task.isPendingDelete !== true,
    ).length;
    document.title = `Study Planner - ${activeTasks} active tasks`;
  }, [tasks]);
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Header />
        <div className="mt-8 space-y-6">
          <TaskForm
            onAddTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
          />
          <TaskStats tasks={tasks} />
          <section aria-label="Навчальні завдання">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">Мої завдання</h2>
              <TaskFilters
                tasks={tasks}
                currentFilter={currentFilter}
                onChangeFilter={handleFilterChange}
                onClearCompleted={openClearCompletedConfirmation}
              />
            </div>
            {isLoading ? (
              <p aria-live="polite" className="py-8 text-center text-slate-600">
                Завантаження завдань…
              </p>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  className="mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                  onClick={refetch}
                  type="button"
                >
                  Спробувати ще раз
                </button>
              </div>
            ) : (
              <>
                <TaskList
                  tasks={tasks}
                  currentFilter={currentFilter}
                  onToggle={handleToggleTask}
                  onEdit={setEditingTask}
                  onView={(task) => setActiveModal({ type: "details", task })}
                  onDelete={(task) => setActiveModal({ type: "delete", task })}
                />
                {total > pageSize && (
                  <nav
                    aria-label="Сторінки завдань"
                    className="mt-5 flex items-center justify-center gap-4"
                  >
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => changePage(currentPage - 1)}
                      type="button"
                    >
                      Попередня
                    </button>
                    <span className="text-sm text-slate-600">
                      Сторінка {currentPage} із {Math.ceil(total / pageSize)}
                    </span>
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:opacity-50"
                      disabled={currentPage * pageSize >= total}
                      onClick={() => changePage(currentPage + 1)}
                      type="button"
                    >
                      Наступна
                    </button>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      <Modal
        open={activeModal !== null}
        title={
          activeModal?.type === "details"
            ? activeModal.task.title
            : activeModal?.type === "delete"
              ? "Підтвердити видалення"
              : "Очистити виконані завдання?"
        }
        onClose={closeModal}
        actions={
          activeModal?.type === "details" ? (
            <>
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={closeModal}
                type="button"
              >
                Закрити
              </button>
              <button
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                onClick={() => {
                  setEditingTask(activeModal.task);
                  setActiveModal(null);
                }}
                type="button"
              >
                Редагувати
              </button>
            </>
          ) : activeModal?.type === "delete" ? (
            <>
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                disabled={isModalBusy}
                onClick={closeModal}
                type="button"
              >
                Скасувати
              </button>
              <button
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                disabled={isModalBusy}
                onClick={() => {
                  setIsModalBusy(true);
                  void handleConfirmDelete();
                }}
                type="button"
              >
                {isModalBusy ? "Видалення…" : "Видалити"}
              </button>
            </>
          ) : activeModal?.type === "clear-completed" ? (
            <>
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                disabled={isModalBusy}
                onClick={closeModal}
                type="button"
              >
                Скасувати
              </button>
              <button
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                disabled={isModalBusy}
                onClick={() => void handleConfirmClearCompleted()}
                type="button"
              >
                Видалити {activeModal.tasks.length} завдань
              </button>
            </>
          ) : null
        }
      >
        {activeModal?.type === "details" ? (
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-500">Опис</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-800">
                {activeModal.task.description || "Опис відсутній"}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-semibold text-slate-500">Категорія</dt>
                <dd className="mt-1 text-slate-800">
                  {categoryLabels[activeModal.task.category]}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Пріоритет</dt>
                <dd className="mt-1 text-slate-800">
                  {priorityLabels[activeModal.task.priority]}
                </dd>
              </div>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Стан</dt>
              <dd className="mt-1 text-slate-800">
                {activeModal.task.completed ? "Виконано" : "До виконання"}
              </dd>
            </div>
          </dl>
        ) : activeModal?.type === "delete" ? (
          <p className="text-sm text-slate-700">
            Видалити завдання «{activeModal.task.title}»? Цю дію не можна
            скасувати.
          </p>
        ) : activeModal?.type === "clear-completed" ? (
          <p className="text-sm text-slate-700">
            Буде видалено виконаних завдань: {activeModal.tasks.length}. Цю дію
            не можна скасувати.
          </p>
        ) : null}
      </Modal>
      <Toast />
    </main>
  );
}

export default App;
