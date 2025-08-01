import { Routes, Route } from 'react-router-dom';
import Watchlist from './pages/watchlist';
import CoinDetail from './pages/coindetial';
import Home from './pages/home';
import Navbar from './components/navbar';

function App() {
 

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
  
    </>
  );
}

export default App;
