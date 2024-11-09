import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import Home from "../../pages/Home/Home";
import ItemPage from "../../pages/Itempage/Itempage";
import MobPage from "../../pages/MobPage/MobPage";
import Scroll from "../../pages/ScrollPage/ScrollPage";
import UpgradeSimulPage from "../../pages/UpgradeSimulPage/UpgradeSimulPage";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/mob" element={<MobPage />} />
          <Route path="/scroll" element={<Scroll />} />
          <Route path="/item/:itemId" element={<ItemPage />} />
          <Route path="/mob/:mobName" element={<MobPage />} />
          <Route path="/scroll/:scrollName" element={<Scroll />} />
          <Route path="/upgradeSimul" element={<UpgradeSimulPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;