import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Nav.css";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-left">
          <Link className="navbarMenu" to={"/"}>
            MO
          </Link>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          &#9776; {/* 햄버거 아이콘 */}
        </div>

        <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
          <Link className="navbarMenu" to={"/"} onClick={toggleMenu}>
            아이템
          </Link>
          <Link className="navbarMenu" to={"/mob"} onClick={toggleMenu}>
            몬스터
          </Link>
          <Link className="navbarMenu" to={"/scroll"} onClick={toggleMenu}>
            주문서
          </Link>
          <Link
            className="navbarMenu"
            to={"/upgradeSimul"}
            onClick={toggleMenu}
          >
            강화 시뮬레이터
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;
