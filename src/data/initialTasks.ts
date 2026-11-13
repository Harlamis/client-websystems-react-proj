import type { ITask } from "../types/ITask";

export const initialTasks: ITask[] = [
  {
    id: "study-planner-react",
    title: "Опрацювати компоненти React",
    description: "Повторити props, стан і умовний рендеринг.",
    completed: false,
    priority: "high",
    category: "Study",
  },
  {
    id: "study-planner-typescript",
    title: "Виконати вправи з TypeScript",
    description: "Попрактикуватися з типами та інтерфейсами.",
    completed: true,
    priority: "medium",
    category: "Study",
  },
];
