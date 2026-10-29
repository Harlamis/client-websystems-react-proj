export const TaskPriority = {
  Low: 1,
  Medium: 2,
  High: 3,
} as const;

export type TaskPriorityType = (typeof TaskPriority)[keyof typeof TaskPriority];
