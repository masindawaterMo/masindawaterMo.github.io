import React, { useState, useEffect } from "react";
import ItemCard from "../../components/Card/ItemCard/ItemCard";
import item from "../../data/item";
import "./Home.css";
import ItemFilter from "../../components/ItemFilter/ItemFilter";

const Home = () => {
  const [filteredItems, setFilteredItems] = useState(() => {
    const storedItems = sessionStorage.getItem("filteredItems");
    return storedItems ? JSON.parse(storedItems) : item;
  });

  useEffect(() => {
    // filteredItems가 변경될 때마다 sessionStorage에 저장
    sessionStorage.setItem("filteredItems", JSON.stringify(filteredItems));
  }, [filteredItems]);

  return (
    <div id="wrap">
      <h1>Maple History Mo</h1>
      <div className="container">
        {/* 필터 결과를 setFilteredItems로 전달받음 */}
        <ItemFilter setFilteredItems={setFilteredItems} />
      </div>

      <div className="container">
        <div className="raw">
          {filteredItems.map((filteredItem, i) => {
            return filteredItem.imgCode !== 0 ? (
              <ItemCard item={filteredItem} i={i} key={filteredItem.코드} />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
