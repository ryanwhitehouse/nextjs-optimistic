import React, { useState } from "react";
import { useRouter } from "next/router";
import { fetchTodoById } from "../networking/mockAPI";
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useUpdateTodo } from "@/hooks/useUpdateTodo";

const TodoDetail: React.FC = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10)

  const [updatedDescription, setUpdatedDescription] = useState<string>();
  const [updatedName, setUpdatedName] = useState<string>();

  const { data: todo, isLoading } = useQuery(['todos', id], () => fetchTodoById(id), { staleTime: Infinity })
  const updateTodo = useUpdateTodo()
  
  const handleUpdate = async () => {
    if (!id || !todo) return

    updateTodo.mutate({ id: id, name: updatedName ?? todo.name, description: updatedDescription ?? todo.description });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedName(e.target.value)
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedDescription(e.target.value)
  };

  if (!id) {
    return <div>Error: {"Item not found"}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!todo) {
    return <div>Error: {"Item not found"}</div>;
  }

  return (
    <div>
      <h1 style={{ padding: '15px' }}>{updatedName ?? todo.name}</h1>
      <p style={{ padding: '10px', paddingLeft: '15px' }}>{updatedDescription ?? todo.description}</p>
      <div style={{ display: 'flex', width: '100%', marginTop: '20px' }}>
        <label htmlFor={'nameInput'} style={{ flex: 1, minWidth: '100px', padding: '10px' }}>
          Name:
        </label>
        <input 
          id="nameInput"
          style={{ flex: 10, padding: '10px' }}
          value={updatedName ?? todo.name} 
          onChange={handleNameChange} 
          aria-label={updatedName ?? todo.name} />
      
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        <label htmlFor={'descriptionInput'} style={{ flex: 1, padding: '10px', minWidth: '100px' }}>
          Description:
        </label>
        <input
          id="descriptionInput"
          style={{ flex: 10, padding: '10px' }}
          value={updatedDescription || todo.description}
          onChange={handleDescriptionChange}
        />
      </div>
      <button 
        style={{ marginTop: '15px', marginRight: '10px', padding: '10px', backgroundColor: 'green' }} 
        onClick={() => handleUpdate()}
        disabled={updateTodo.isLoading}
      >Save changes</button>
      <Link style={{ padding: '5px' }} href="/" shallow={true}>Back to list</Link>
    </div>
  );
};

export default TodoDetail;
