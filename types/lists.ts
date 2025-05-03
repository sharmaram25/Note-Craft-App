export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoList {
  id: string;
  title: string;
  items: TodoItem[];
  createdAt: string;
  updatedAt: string;
  color?: string;
}