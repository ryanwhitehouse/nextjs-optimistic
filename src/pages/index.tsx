import ItemList from '../components/TodoList'
import { Toaster } from 'react-hot-toast'

export default function Page() {
  return (
    <>
      <ItemList />
      <Toaster />
    </>
  );
}

