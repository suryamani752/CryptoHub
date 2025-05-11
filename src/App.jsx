import { Routes, Route } from "react-router-dom";
import CardCoin from "./components/CardCoin";
import CoinDetails from "./components/CoinDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CardCoin />} />
      <Route path="/coin/:id" element={<CoinDetails />} />
    </Routes>
  );
}

export default App;
