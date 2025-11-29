import ShoppingList from '../components/ShoppingList';
import Navbar from '../components/NavbarHousehold';

function ShoppingListPage() {
  return(
    <section>
        <Navbar />
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-amber-100 p-6 w-screen mt-5">
        <div className="w-full max-w-2xl">
            <ShoppingList />
        </div>
        </div>
    </section>

  )
}

export default ShoppingListPage;