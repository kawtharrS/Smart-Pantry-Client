import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Login from './pages/Login';
import Choose from './pages/choose';
import HouseholdMain from './pages/householdMain';
import IngredientsEntry from './pages/IngredientsEntry';
import RecipeEntry from './pages/RecipePage';

import WeeklyPlan from './pages/WeeklyMeelPLan';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/choose" element={<Choose />} />
            <Route path="/householdMain" element={<HouseholdMain />} />
            <Route path="/ingEntry" element={<IngredientsEntry />} />
            <Route path="/recipeEntry" element={<RecipeEntry />} />
            <Route path="/mealplan" element={<WeeklyPlan />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;