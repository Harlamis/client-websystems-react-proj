import { Header } from "./components/Header";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskStats } from "./components/TaskStats";
import { Toast } from "./components/Toast";

function App() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Header />
        <div className="mt-8 space-y-6">
          <TaskForm />
          <TaskStats />
          <section aria-label="Навчальні завдання">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">Мої завдання</h2>
              <TaskFilters />
            </div>
            <TaskList />
          </section>
        </div>
      </div>
      <Toast />
    </main>
  );
}

export default App;
