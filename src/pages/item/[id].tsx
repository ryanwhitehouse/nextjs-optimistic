import ItemDetail from "../../components/TodoDetail";
import { Toaster } from 'react-hot-toast'

const ItemDetailPage: React.FC = () => {
  return (
    <>
      <ItemDetail />
      <Toaster />
    </>
  )
};

export default ItemDetailPage;