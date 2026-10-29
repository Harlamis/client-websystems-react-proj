import type { ITask } from "../types/ITask";

export interface ITaskListItemProps {
  task: ITask;
  onDelete(): void;
  onComplete(): void;
}

export const TaskListItem = ({
  task: { title, description, isCompleted, priority, category },
  onDelete,
  onComplete,
}: ITaskListItemProps) => {
  return (
    <li
      className={`group flex max-h-16 flex-col ${isCompleted && "text-gray-500"}`}
      onClick={onComplete}
    >
      <div className="flex justify-between">
        <span className="text-2xl text-gray-900">{title}</span>
        <span className="flex justify-around">
          <span className="rounded-2xl bg-gray-500 text-black">{category}</span>
          <span
            className={`${priority == "Low" ? "bg-green-300" : priority == "Medium" ? "bg-amber-400" : "bg-red-950"}`}
          >
            {priority}
          </span>
        </span>
        <button type="button" className="text-red-800" onClick={onDelete}>
          X
        </button>
      </div>
      <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:mt-2 group-hover:max-h-20 group-hover:opacity-100">
        <p className="text-sm text-gray-800">{description}</p>
      </div>
    </li>
  );
};
