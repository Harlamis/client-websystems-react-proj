import type { TodoDto, TodosResponse } from "../types/ApiTodo";
import type { ITask } from "../types/ITask";
import { client } from "../api/httpClient";

const toTask = (dto: TodoDto): ITask => {
  return {
    id: dto.id.toString(),
    title: dto.todo,
    description: "",
    priority: "medium",
    category: "Home",
    completed: dto.completed,
  };
};
const toTodoRequset = (task: Omit<ITask, "id" | "completed">) => {
  return {
    userId: 1,
    todo: task.title,
    completed: false,
  };
};

export const taskRepository = {
  getAll: async (limit: number, skip: number, signal?: AbortSignal) => {
    const { data } = await client.get<TodosResponse>("/todos", {
      params: { limit, skip },
      signal,
    });
    return { tasks: data.todos.map(toTask), total: data.total };
  },
  getById: async (id: string | number, signal?: AbortSignal) => {
    const { data } = await client.get<TodoDto>(`/todos/${id}`, { signal });
    return toTask(data);
  },
  create: async (task: Omit<ITask, "id" | "completed">) => {
    const { data } = await client.post<TodoDto>(
      "/todos/add",
      toTodoRequset(task),
    );
    return toTask(data);
  },
  update: async (id: string | number, task: Partial<ITask>) => {
    const payload: Record<string, string | number | boolean> = {};

    if (task.title !== undefined) payload.todo = task.title;
    if (task.completed !== undefined) payload.completed = task.completed;

    const { data } = await client.patch<TodoDto>(`/todos/${id}`, payload);
    return toTask(data);
  },
  delete: async (id: string | number) => {
    const { data } = await client.delete(`/todos/${id}`);
    return data;
  },
};
