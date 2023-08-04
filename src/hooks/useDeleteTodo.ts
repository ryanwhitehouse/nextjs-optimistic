import { deleteTodo } from "@/networking/mockAPI"
import { Todo } from "@/networking/models"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useDeleteTodo = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (id: number) => deleteTodo(id),
      onMutate: async (id: number) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ['todos'] })
        await queryClient.cancelQueries({ queryKey: ['todos', id] })
    
        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
    
        const newTodos = previousTodos?.filter(x => x.id !== id)
        // Optimistically update to the new value
        queryClient.setQueryData(['todos'], newTodos)
    
        // Return a context with the previous and new todo
        return { previousTodos, newTodos }
      },
      // If the mutation fails, use the context we returned above
      onError: (error: Error, id, context) => {
        toast.error(`Unexpected Error: ${error.message}`)
        queryClient.setQueryData(['todos'], context?.previousTodos)
      },
      onSuccess: async (_, id) => {
        // ✅ refetch the comments list for our blog post
        await queryClient.invalidateQueries({ queryKey: ['todos'] })
        await queryClient.invalidateQueries({ queryKey: ['todos', id] })
      },
    })
  }