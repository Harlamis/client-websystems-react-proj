import type { ITask } from "./ITask";

export type TaskAction =
  | { type: "ADD_TASK"; payload: Omit<ITask, "completed"> }
  | { type: "TOGGLE_TASK"; payload: { id: string } }
  | { type: "UPDATE_TASK"; payload: ITask }
  | { type: "REQUEST_DELETE"; payload: { id: string } }
  | { type: "CONFIRM_DELETE"; payload: { id: string } }
  | { type: "UNDO_DELETE"; payload: { id: string } }
  | { type: "REQUEST_CLEAR_COMPLETED" }
  | { type: "CONFIRM_CLEAR_COMPLETED" }
  | { type: "UNDO_CLEAR_COMPLETED" }
  | { type: "RESET_TASKS"; payload: ITask[] };
