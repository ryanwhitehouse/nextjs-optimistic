import { render, screen, within } from '@testing-library/react'
import TodoList from '../TodoList'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 
const deleteTodoMock = jest.fn()

function setup(jsx: any) {
  const queryClient = new QueryClient()
  return render(
      <QueryClientProvider client={queryClient}>
          {jsx}
      </QueryClientProvider>
  )
}

jest.mock('../../networking/mockAPI', () => ({
  fetchTodos: () => [{
    id: 1,
    name: 'test',
    description: 'my test todo',
  },
  {
    id: 2,
    name: 'test2',
    description: 'my test todo2',
  }],
  fetchTodoById: () => ({
    id: 1,
    name: 'test',
    description: 'my test todo',
  }),
  deleteTodo: (id: number) => deleteTodoMock(id)
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      id: 1
    }
  })
}))

describe('ListView', () => {
  it('renders a list of todos', async () => {
    setup(<TodoList />)
 
    const title = await screen.findByText('test')
    const description = await screen.findByText('my test todo')
 
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()

    const title2 = await screen.findByText('test2')
    const description2 = await screen.findByText('my test todo2')
 
    expect(title2).toBeInTheDocument()
    expect(description2).toBeInTheDocument()
  })

  it('calls delete when requested', async () => {
    const user = userEvent.setup()
    
    setup(<TodoList />)
    
    const description2 = await screen.findByText('my test todo2')
    expect(description2).toBeInTheDocument()

    const firstListItem = await screen.findByTestId('list-item-1');
    expect(firstListItem).toBeInTheDocument();
    
    const { getByRole } = within(firstListItem)
    await user.click(getByRole('button', {name: /delete/i}))

    expect(deleteTodoMock).toBeCalledTimes(1)
    expect(deleteTodoMock).toHaveBeenCalledWith(1)
  })
})