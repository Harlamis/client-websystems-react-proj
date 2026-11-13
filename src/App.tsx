import { useEffect } from "react";
import { Header } from "./components/Header";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { Toast } from "./components/Toast";
import { useTasks } from "./hooks/useTasks";
import type { ITask, TaskFilter } from "./types/ITask";
import { useTaskContext } from "./hooks/useTaskContext";

function App() {
  const pageSize = 10;
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

  const handleDeleteTask = async (task: ITask) => {
    try {
      const deletedTask = await deleteTask(task.id);
      showToast(`Завдання «${deletedTask.title}» видалено.`, "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Не вдалося видалити завдання"), "error");
    }
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((task) => task.completed);
    if (completedTasks.length === 0) return;

    try {
      await Promise.all(completedTasks.map((task) => deleteTask(task.id)));
      showToast(
        `Видалено виконаних завдань: ${completedTasks.length}.`,
        "success",
      );
    } catch (error) {
      showToast(
        getErrorMessage(error, "Не вдалося видалити всі виконані завдання"),
        "error",
      );
    }
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
                onClearCompleted={handleClearCompleted}
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
                  onDelete={handleDeleteTask}
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
      <Toast />
    </main>
  );
}

export default App;
