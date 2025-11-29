import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Login from './pages/Login';
import Choose from './pages/choose';
import HouseholdMain from './pages/householdMain';
import SideBarNav from './pages/IngredientsEntry.tsx';
import ShoppingListPage from './pages/shoppingListPage.tsx'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/householdMain" element={<HouseholdMain />} />
          <Route path="/ingEntry" element={<SideBarNav />} />
          <Route path="/shoppingList" element={<ShoppingListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;