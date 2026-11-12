import { useEffect, useState } from "react";
import type { ITask } from "../types/ITask";
import { taskRepository } from "../repository/taskRepository";
import axios from "axios";

export const useTasks = (limit: number) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  useEffect(() => {
    const abortController = new AbortController();
    const skip = (currentPage - 1) * limit;
    const loadTasks = async () => {
      try {
        const { tasks, total } = await taskRepository.getAll(
          limit,
          skip,
          abortController.signal,
        );
        setTasks(tasks);
        setTotal(total);
      } catch (error) {
        if (axios.isCancel(error)) return;
        else setError("Could not fetch tasks!");
      } finally {
        if (!abortController.signal.aborted) setIsLoading(false);
      }
    };
    loadTasks();
    return () => abortController.abort();
  }, [currentPage, limit, reloadTrigger]);

  const refetch = () => {
    setError(null);
    setIsLoading(true);
    setReloadTrigger((prev) => prev + 1);
  };

  const changePage = (newPage: number) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(newPage);
  };

  const createTask = async (task: Omit<ITask, "id" | "completed">) => {
    const createdTask = await taskRepository.create(task);
    setTasks((prev) => [
      { id: crypto.randomUUID(), completed: createdTask.completed, ...task },
      ...prev,
    ]);
    setTotal((prev) => prev + 1);
  };

  const updateTask = async (task: Partial<ITask>, id: number | string) => {
    if (!Number.isNaN(Number(id))) {
      await taskRepository.update(id, task);
    }
    setTasks((prev) =>
      prev.map((t) => (String(t.id) === String(id) ? { ...t, ...task } : t)),
    );
  };

  const deleteTask = async (id: number | string) => {
    if (!Number.isNaN(Number(id))) {
      await taskRepository.delete(id);
    }
    setTasks((prev) => prev.filter((t) => String(t.id) !== String(id)));
    setTotal((prev) => prev - 1);
  };
  return {
    tasks,
    total,
    isLoading,
    error,
    currentPage,
    changePage,
    refetch,
    createTask,
    updateTask,
    deleteTask,
  };
};
