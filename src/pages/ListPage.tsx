import CardList from "../components/cardList";
import Navbar from '../components/NavbarHousehold';

function ListPage() {
  return (
    <>
    <Navbar />
    <div className="p-4 w-screen flex justify-center items-center">
      <CardList />
    </div>
    </>
  )
}

export default ListPage;