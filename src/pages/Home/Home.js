import React, { useState, useEffect } from "react";
import ItemCard from "../../components/Card/ItemCard/ItemCard";
import item from "../../data/item";
import "./Home.css";
import ItemFilter from "../../components/ItemFilter/ItemFilter";

const Home = () => {
  const [filteredItems, setFilteredItems] = useState(() => {
    const storedItems = sessionStorage.getItem("filteredItems");
    return storedItems ? JSON.parse(storedItems) : item.slice(0, 10); // 처음에는 10개만 로드
  });
  const [itemsToShow, setItemsToShow] = useState(50); // 한 번에 보여줄 아이템 수

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("filteredItems");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("filteredItems", JSON.stringify(filteredItems));
  }, [filteredItems]);

  // 무한 스크롤을 위한 스크롤 핸들러
  const handleScroll = () => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;
    if (bottom) {
      setItemsToShow((prev) => Math.min(prev + 10, item.length)); // 10개씩 추가
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="wrap">
      <h1>Maple History Mo</h1>
      <div className="container">
        <ItemFilter setFilteredItems={setFilteredItems} />
      </div>

      <div className="container">
        <div className="raw">
          {filteredItems.slice(0, itemsToShow).map((filteredItem, i) => {
            return (
              <ItemCard item={filteredItem} i={i} key={filteredItem.코드} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
