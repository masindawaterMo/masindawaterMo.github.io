import { Link } from "react-router-dom";
import React from "react";
import "./Nav.css";

function Nav() {
  return (
    <div>
      <div className="navbar">
        <div className="navbar-left">
          <Link className="navbarMenu" to={"/"}>
            MO
          </Link>
        </div>

        <div className="navbar-right">
          <Link className="navbarMenu" to={"/item"}>
            아이템
          </Link>
          <Link className="navbarMenu" to={"/mob"}>
            몬스터
          </Link>
          <Link className="navbarMenu" to={"/scroll"}>
            주문서
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;
