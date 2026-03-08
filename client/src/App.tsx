import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PricePrediction from './pages/PricePrediction';
import SpecsPrediction from './pages/SpecsPrediction';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="predict" element={<PricePrediction />} />
          <Route path="specs" element={<SpecsPrediction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;