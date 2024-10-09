import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "../../pages/mainPage/MainPage";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import Home from "../../pages/Home/Home";
import ItemPage from "../../pages/Itempage/Itempage";
import MobPage from "../../pages/MobPage/MobPage";
import Scroll from "../../pages/ScrollPage/ScrollPage";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        // 새로고침 감지 시 홈으로 리다이렉트
        window.location.href = "/";
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/mob" element={<MobPage />} />
          <Route path="/scroll" element={<Scroll />} />
          <Route path="/item/:itemId" element={<ItemPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
