import React, { useState } from "react";
import ItemCard from "../../components/Card/ItemCard/ItemCard";
import item from "../../data/item";
import "./Home.css";
import ItemFilter from "../../components/ItemFilter/ItemFilter";

const Home = () => {
  const [filteredItems, setFilteredItems] = useState(item); // 초기에는 모든 아이템을 표시

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
              <ItemCard
                item={filteredItem}
                i={i}
                key={filteredItem.코드}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
