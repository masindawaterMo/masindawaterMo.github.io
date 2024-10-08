import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "../../pages/mainPage/MainPage";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import Home from "../../pages/Home/Home";
import ItemPage from "../../pages/Itempage/Itempage";
import MobPage from "../../pages/MobPage/MobPage";
import Scroll from "../../pages/ScrollPage/ScrollPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<ItemPage />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/mob" element={<MobPage />} />
          <Route path="/scroll" element={<Scroll />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
