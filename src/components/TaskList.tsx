import { useTaskContext } from "../hooks/useTaskContext";
import { TaskItem } from "./TaskItem";

export const TaskList = () => {
  const { tasks, currentFilter } = useTaskContext();
  let filteredTasks;
  switch (currentFilter) {
    case "active":
      filteredTasks = tasks.filter((t) => !t.completed);
      break;
    case "completed":
      filteredTasks = tasks.filter((t) => t.completed);
      break;
    default:
      filteredTasks = tasks;
  }
  const totalTaskCount = tasks.length;
  if (filteredTasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-800">
          {totalTaskCount === 0
            ? "Завдань поки немає."
            : "За цим фільтром завдань немає."}
        </p>
        {totalTaskCount === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            Додайте перше навчальне завдання.
          </p>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
};
