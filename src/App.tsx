import { useState } from "react";
import { Header } from "./components/Header";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { initialTasks } from "./data/initialTasks";
import type { ITask, TaskFilter } from "./types/ITask";

function App() {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("all");

  const completedCount = tasks.filter((task) => task.completed).length;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const addTask = (task: Omit<ITask, "id">) => {
    setTasks((currentTasks) => [
      { ...task, id: crypto.randomUUID() },
      ...currentTasks,
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id),
    );
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Header />
        <div className="mt-8 space-y-6">
          <TaskForm onAddTask={addTask} />
          <TaskStats
            total={tasks.length}
            completed={completedCount}
            active={tasks.length - completedCount}
          />
          <section aria-label="Навчальні завдання">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Мої завдання
              </h2>
              <TaskFilters
                activeFilter={filter}
                onFilterChange={setFilter}
                tasks={tasks}
              />
            </div>
            <TaskList
              tasks={visibleTasks}
              totalTaskCount={tasks.length}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
