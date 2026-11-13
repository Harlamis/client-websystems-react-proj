import { useEffect, useRef, useState } from "react";
import type { ITask } from "../types/ITask";
import { taskRepository } from "../repository/taskRepository";
import axios from "axios";
import { useLocalStorage } from "./useLocalStorage";

type LocalTaskDetails = Pick<ITask, "description" | "priority" | "category">;

export const useTasks = (limit: number) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [localTaskDetails, setLocalTaskDetails] = useLocalStorage<
    Record<string, LocalTaskDetails>
  >("task_details", {});
  const localTaskDetailsRef = useRef(localTaskDetails);

  useEffect(() => {
    const abortController = new AbortController();
    const skip = (currentPage - 1) * limit;
    const loadTasks = async () => {
      try {
        const { tasks: apiTasks, total } = await taskRepository.getAll(
          limit,
          skip,
          abortController.signal,
        );
        const tasks = apiTasks.map((task) => ({
          ...task,
          ...localTaskDetailsRef.current[task.id],
        }));
        setTasks(tasks);
        setTotal(total);
      } catch (error) {
        if (axios.isCancel(error)) return;
        else setError("Не вдалося завантажити завдання.");
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
    try {
      const apiTask = await taskRepository.create(task);
      const createdTask: ITask = {
        ...apiTask,
        ...task,
        id: apiTask.id,
        completed: apiTask.completed,
      };
      const nextLocalTaskDetails = {
        ...localTaskDetailsRef.current,
        [createdTask.id]: {
          description: task.description,
          priority: task.priority,
          category: task.category,
        },
      };
      localTaskDetailsRef.current = nextLocalTaskDetails;
      setLocalTaskDetails(nextLocalTaskDetails);
      setTasks((prev) => [createdTask, ...prev]);
      setTotal((prev) => prev + 1);
      return createdTask;
    } catch (error) {
      throw new Error("Не вдалося створити завдання.", { cause: error });
    }
  };

  const updateTask = async (task: Partial<ITask>, id: number | string) => {
    try {
      const existingTask = tasks.find(
        (currentTask) => String(currentTask.id) === String(id),
      );
      if (!existingTask) {
        throw new Error("Task not found");
      }

      const serverTask = Number.isNaN(Number(id))
        ? existingTask
        : await taskRepository.update(id, task);
      const updatedTask = {
        ...existingTask,
        ...task,
        title: serverTask.title,
        completed: serverTask.completed,
      };

      const nextLocalTaskDetails = {
        ...localTaskDetailsRef.current,
        [String(id)]: {
          description: updatedTask.description,
          priority: updatedTask.priority,
          category: updatedTask.category,
        },
      };
      localTaskDetailsRef.current = nextLocalTaskDetails;
      setLocalTaskDetails(nextLocalTaskDetails);
      setTasks((prev) =>
        prev.map((currentTask) =>
          String(currentTask.id) === String(id) ? updatedTask : currentTask,
        ),
      );
      return updatedTask;
    } catch (error) {
      throw new Error("Не вдалося оновити завдання.", { cause: error });
    }
  };

  const deleteTask = async (id: number | string) => {
    try {
      const deletedTask = tasks.find(
        (currentTask) => String(currentTask.id) === String(id),
      );
      if (!deletedTask) {
        throw new Error("Task not found");
      }

      if (!Number.isNaN(Number(id))) {
        await taskRepository.delete(id);
      }
      const nextLocalTaskDetails = { ...localTaskDetailsRef.current };
      delete nextLocalTaskDetails[String(id)];
      localTaskDetailsRef.current = nextLocalTaskDetails;
      setLocalTaskDetails(nextLocalTaskDetails);
      setTasks((prev) =>
        prev.filter((currentTask) => String(currentTask.id) !== String(id)),
      );
      setTotal((prev) => prev - 1);
      return deletedTask;
    } catch (error) {
      throw new Error("Не вдалося видалити завдання.", { cause: error });
    }
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
