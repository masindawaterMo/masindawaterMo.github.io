import React, { useState, useEffect } from "react";
import ItemCard from "../../components/Card/ItemCard/ItemCard";
import item from "../../data/item";
import ItemFilter from "../../components/ItemFilter/ItemFilter";
import styles from "./Home.module.css";
import { useParams, useNavigate } from "react-router-dom";

const Home = () => {
  const [filteredItems, setFilteredItems] = useState(() => {
    const storedItems = sessionStorage.getItem("filteredItems");
    return storedItems ? JSON.parse(storedItems) : item.slice(0, 10); // 처음에는 10개만 로드
  });
  const [itemsToShow, setItemsToShow] = useState(50); // 한 번에 보여줄 아이템 수

  const [searchItemInput, setSearchItemInput] = useState("");
  const navigate = useNavigate();

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

  // 검색어 입력 시 실행되는 함수
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchItemInput(searchValue);

    if (searchValue) {
      const filtered = item.filter((i) =>
        i.이름.toLowerCase().startsWith(searchValue)
      );
      setFilteredItems(filtered); // 필터링된 아이템 상태 업데이트
    }
  };

  const handleItemSearch = (itemId) => {
    if (itemId) {
      navigate(`/item/${itemId}`); // 아이템 ID를 URL로 전달
    }
  };

  return (
    <div id="wrap">
      <h1>Maple History Mo</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="ex) 글라디우스"
          value={searchItemInput}
          onChange={handleSearch} // 검색어 입력 시 필터링
        />
      </div>
      <div className={styles["filter-container"]}>
        <ItemFilter setFilteredItems={setFilteredItems} />
      </div>

      <div className={styles["container"]}>
        <div className={styles["row"]}>
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
