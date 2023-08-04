import React, { useCallback } from "react";
import Link from "next/link";
import { fetchTodos, fetchTodoById } from "../networking/mockAPI";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import { Todo } from "@/networking/models";

const ListItems = React.FC = ({ todos, isLoading }: { todos?: Todo[], isLoading: boolean }) => {
  const deleteTodo = useDeleteTodo()
  const queryClient = useQueryClient()

  const handleDelete = (id: number) => {
    deleteTodo.mutate(id)
  }
  
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!todos) {
    return <div>No Results Found</div>;
  }

  return (
    <ul style={{padding: '5px'}}>
    {todos.map((todo: Todo) => (
      <li 
        key={todo.id} 
        data-testid={`list-item-${todo.id}`} 
        style={{display: 'flex', padding: '5px'}}
        onMouseEnter={async () => {
          await queryClient.prefetchQuery(['todos', todo.id], () => fetchTodoById(todo.id), { staleTime: 10 * 1000 })
        }}>
        <Link style={{flex: 10}} href={`/item/${todo.id}`} shallow={true}>
          <p>
            <b>{todo.name}</b>
          </p>
          <p>{todo.description}</p>
        </Link>
        <button style={{flex: 1, minWidth: '75px', color: 'white', backgroundColor: '#C60C30'}} onClick={() => handleDelete(todo.id)}>Delete</button>
      </li>
    ))}
  </ul>
  )
}

const TodoList: React.FC = () => {
  
  const { data: todos, isLoading } = useQuery(['todos'], fetchTodos, { staleTime: Infinity })
  
  return (
    <div style={{minWidth: '350px'}}>
      <h1 style={{padding: '15px'}}>Items</h1>
      <ListItems todos={todos} isLoading={isLoading} />
    </div>
  );
};

export default TodoList;
