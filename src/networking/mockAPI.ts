// -- DO NOT CHANGE THIS FILE --
// This is a mock implementation of an API
// It is not a part of the challenge to fix this file's implementation

import { Todo } from "./models";


const todos: Todo[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `Todo ${i + 1}`,
  description: `Description ${i + 1}`,
}));

const randomDelay = () => Math.random() * 5 * 1000;
const shouldFail = () => Math.random() < 0.2;

export const fetchTodos = async (): Promise<Todo[]> => {
  if (shouldFail()) {
    throw new Error("Failed to fetch items.");
  }
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  return todos;
};

export const fetchTodoById = async (id: number): Promise<Todo | undefined> => {
  if (shouldFail()) {
    throw new Error(`Failed to fetch item with ID ${id}.`);
  }
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  return todos.find((todo) => todo.id === id);
};

export const updateTodo = async (updatedTodo: Todo): Promise<Todo> => {
  if (shouldFail()) {
    throw new Error(`Failed to update item with ID ${updatedTodo.id}.`);
  }
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  const index = todos.findIndex((todo) => todo.id === updatedTodo.id);

  if (index === -1) {
    throw new Error(`Item with ID ${updatedTodo.id} not found.`);
  }

  todos[index] = updatedTodo;
  return updatedTodo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  if (shouldFail()) {
    throw new Error(`Failed to delete item with ID ${id}.`);
  }
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    throw new Error(`Item with ID ${id} not found.`);
  }

  todos.splice(index, 1);
};
