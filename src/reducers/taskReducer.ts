import type { ITask } from "../types/ITask";
import type { TaskAction } from "../types/TaskAction";

export function taskReducer(state: ITask[], action: TaskAction): ITask[] {
  switch (action.type) {
    case "ADD_TASK":
      return [{ ...action.payload, completed: false }, ...state];
    case "TOGGLE_TASK":
      return state.map((task) => {
        if (task.id !== action.payload.id) {
          return task;
        } else return { ...task, completed: !task.completed };
      });
    case "UPDATE_TASK":
      return state.map((task) => {
        if (task.id !== action.payload.id) {
          return task;
        } else return action.payload;
      });
    case "REQUEST_DELETE":
      return state.map((task) => {
        if (task.id !== action.payload.id) {
          return task;
        } else return { ...task, isPendingDelete: true };
      });
    case "CONFIRM_DELETE":
      return state.filter((task) => task.id !== action.payload.id);
    case "UNDO_DELETE":
      return state.map((task) => {
        if (task.id !== action.payload.id) {
          return task;
        } else return { ...task, isPendingDelete: false };
      });
    case "REQUEST_CLEAR_COMPLETED":
      return state.map((task) => {
        if (!task.completed) {
          return task;
        } else return { ...task, isPendingDelete: true };
      });
    case "UNDO_CLEAR_COMPLETED":
      return state.map((task) => {
        if (!task.completed) {
          return task;
        } else return { ...task, isPendingDelete: false };
      });
    case "CONFIRM_CLEAR_COMPLETED":
      return state.filter((task) => task.completed !== true);
    case "RESET_TASKS":
      return action.payload;
    default:
      return state;
  }
}
