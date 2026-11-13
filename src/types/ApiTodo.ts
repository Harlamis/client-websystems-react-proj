export interface TodoDto {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse {
  todos: TodoDto[];
  total: number;
  skip: number;
  limit: number;
}
