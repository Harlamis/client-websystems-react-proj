import { useState, type FormEvent } from "react";
import type { ITask, TaskPriority } from "../types/ITask";
import type { TaskCategory } from "../types/TaskCategory";
import { useTaskContext } from "../hooks/useTaskContext";

const fieldClassName =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

interface ITaskFormFieldsProps {
  editingTask: ITask | null;
  onAddTask: (task: Omit<ITask, "id" | "completed">) => Promise<boolean>;
  onUpdateTask: (task: ITask) => Promise<boolean>;
  onCancelEdit: () => void;
}

const TaskFormFields = ({
  editingTask,
  onAddTask,
  onUpdateTask,
  onCancelEdit,
}: ITaskFormFieldsProps) => {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [description, setDescription] = useState(
    editingTask?.description ?? "",
  );
  const [category, setCategory] = useState<TaskCategory>(
    editingTask?.category ?? "Study",
  );
  const [priority, setPriority] = useState<TaskPriority>(
    editingTask?.priority ?? "medium",
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (editingTask !== null) {
      await onUpdateTask({
        ...editingTask,
        title: trimmedTitle,
        description: description.trim(),
        category,
        priority,
        completed: editingTask.completed,
      });
    } else {
      const created = await onAddTask({
        title: trimmedTitle,
        description: description.trim(),
        category,
        priority,
      });
      if (!created) return;
      setTitle("");
      setDescription("");
      setCategory("Study");
      setPriority("medium");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">
        {editingTask
          ? "Редагувати навчальне завдання"
          : "Додати навчальне завдання"}
      </h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="task-title"
          >
            Назва <span className="text-rose-600">*</span>
          </label>
          <input
            className={fieldClassName}
            id="task-title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Наприклад, опрацювати React Hooks"
            required
            maxLength={100}
          />
        </div>
        <div>
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="task-description"
          >
            Опис
          </label>
          <textarea
            className={`${fieldClassName} min-h-20 resize-y`}
            id="task-description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Коротко опишіть, що потрібно зробити"
            rows={2}
            maxLength={300}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="task-category"
            >
              Категорія
            </label>
            <select
              className={fieldClassName}
              id="task-category"
              name="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TaskCategory)
              }
            >
              <option value="Study">Навчання</option>
              <option value="Home">Дім</option>
              <option value="Work">Робота</option>
              <option value="Misc">Інше</option>
            </select>
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="task-priority"
            >
              Пріоритет
            </label>
            <select
              className={fieldClassName}
              id="task-priority"
              name="priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
            >
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            type="submit"
          >
            {editingTask ? "Зберегти зміни" : "Додати завдання"}
          </button>
          {editingTask && (
            <button
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
              onClick={onCancelEdit}
              type="button"
            >
              Скасувати
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

interface TaskFormProps {
  onAddTask: (task: Omit<ITask, "id" | "completed">) => Promise<boolean>;
  onUpdateTask: (task: ITask) => Promise<boolean>;
}

export const TaskForm = ({ onAddTask, onUpdateTask }: TaskFormProps) => {
  const { editingTask, setEditingTask } = useTaskContext();
  return (
    <TaskFormFields
      key={editingTask?.id ?? "new-task"}
      editingTask={editingTask}
      onAddTask={onAddTask}
      onUpdateTask={onUpdateTask}
      onCancelEdit={() => setEditingTask(null)}
    />
  );
};
