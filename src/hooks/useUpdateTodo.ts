import { updateTodo } from "@/networking/mockAPI"
import { Todo } from "@/networking/models"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

function replaceTodo(todos: Todo[], updatedTodo: Todo) {
  return todos.map(todo => {
      if(todo.id === updatedTodo.id) {
          return updatedTodo;
      }
      return todo;
  });
}

export const useUpdateTodo = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (updatedTodo: Todo) => updateTodo(updatedTodo),
      onMutate: async (updatedTodo: Todo) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ['todos'] })
        await queryClient.cancelQueries({ queryKey: ['todos', updatedTodo.id] })
    
        // Snapshot the previous value
        const previousTodo = queryClient.getQueryData<Todo[]>(['todos', updatedTodo.id])
        const previousTodosList = queryClient.getQueryData<Todo[]>(['todos'])
    
        // Optimistically update to the new value
        queryClient.setQueryData(['todos', updatedTodo.id], updatedTodo)
        queryClient.setQueryData(['todos'], replaceTodo(previousTodosList ?? [], updatedTodo))
    
        // Return a context with the previous and new todo
        return { previousTodosList, previousTodo, updatedTodo }
      },
      // If the mutation fails, use the context we returned above
      onError: (error: Error, { id }, context) => {
        toast.error(`Unexpected Error: ${error.message}`)
        queryClient.setQueryData(['todos', id], context?.previousTodo)
        queryClient.setQueryData(['todos'], context?.previousTodosList)
      },
      onSuccess: async (_, { id }) => {
        // ✅ refetch the comments list for our blog post
        await queryClient.invalidateQueries({ queryKey: ['todos'] })  
        await queryClient.invalidateQueries({ queryKey: ['todos', id] })        
      },
    })
  }