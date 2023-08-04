import { render, screen } from '@testing-library/react'
import TodoDetail from '../TodoDetail'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Todo } from '@/networking/models'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 
const updateTodoMock = jest.fn()

jest.mock('../../networking/mockAPI', () => ({
  fetchTodoById: () => ({
    id: 1,
    name: 'test',
    description: 'my test todo',
  }),
  updateTodo: (todo: Todo) => updateTodoMock(todo)
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      id: 1
    }
  })
}))


function setup(jsx: any) {
  const queryClient = new QueryClient()
  return render(
      <QueryClientProvider client={queryClient}>
          {jsx}
      </QueryClientProvider>
  )
}

describe('ListView', () => {
  it('renders a single todo', async () => {
    setup(<TodoDetail />)
 
    const title = await screen.findByText('test')
    const description = await screen.findByText('my test todo')
 
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it('calls update when requested', async () => {
    const user = userEvent.setup()
    
    setup(<TodoDetail />)
    
    const description = await screen.findByText('my test todo')
    expect(description).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', {name: /test/i}), 'Updated')

    const updatedItem = await screen.findByText('testUpdated')
    expect(updatedItem).toBeInTheDocument()

    expect(updateTodoMock).toBeCalledTimes(0)

    await user.click(screen.getByRole('button', {name: /save changes/i}))

    expect(updateTodoMock).toBeCalledTimes(1)
    expect(updateTodoMock).toHaveBeenCalledWith({'description': 'my test todo', 'id': 1, 'name': 'testUpdated'})
  })
})