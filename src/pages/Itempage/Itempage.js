import item from "../../data/item";
import React, { useState, useEffect } from "react";
import mobDropTable from "../../data/mobDropTable";
import "./ItemPage.css";
import { useParams, useNavigate } from "react-router-dom";
import ItemDetailCard from "../../components/Card/ItemDetailCard/ItemDetailCard";

const ItemPage = () => {
  const [searchItemInput, setSearchItemInput] = useState("");
  const [itemResult, setItemResult] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]); // 추천 검색어 상태
  const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 창 표시 여부
  const { itemId } = useParams(); // URL에서 아이템 ID 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    if (itemId == undefined) return;
    const foundItem = item.find((i) => i.코드 == itemId);

    if (!foundItem) {
      alert("해당 아이템을 찾을 수 없습니다.");
      return;
    }

    const foundMobs = new Set();
    mobDropTable.forEach((mob) => {
      if (Object.values(mob).some((drop) => drop === foundItem.이름)) {
        foundMobs.add(mob);
      }
    });

    let itemDropMobs = "해당 아이템을 드랍하는 몬스터가 없습니다.";
    if (foundMobs.size > 0) {
      itemDropMobs = Array.from(foundMobs)
        .map((mob) => `[${mob.이름}]`)
        .join(", ");
    }

    setSearchItemInput(foundItem.이름);

    setItemResult({
      ...foundItem,
      itemDropMobs,
    });
  }, [itemId]); // itemId가 변경될 때마다 실행

  // 검색어 입력 시 실행되는 함수
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchItemInput(searchValue);

    if (searchValue) {
      const filtered = item.filter((i) =>
        i.이름.toLowerCase().startsWith(searchValue)
      );
      setFilteredItems(filtered); // 필터링된 아이템 상태 업데이트
      setShowSuggestions(filtered.length > 0); // 필터링된 아이템이 있을 경우 추천 창 표시
    } else {
      setShowSuggestions(false); // 검색어가 없을 경우 추천 창 숨김
    }
  };

  // 추천 검색어 클릭 시 실행되는 함수
  const handleSuggestionClick = (selectedItem) => {
    setSearchItemInput(selectedItem.이름); // 선택된 추천어를 검색어로 설정
    searchItem(selectedItem); // 선택된 아이템으로 검색 실행
    closeSuggestions(); // 추천 창 닫기
  };

  // 추천 창 닫기
  const closeSuggestions = () => {
    setFilteredItems([]); // 추천어 리스트 비우기
    setShowSuggestions(false); // 추천 창 숨기기
  };

  // 검색 실행
  const searchItem = (selectedItem) => {
    closeSuggestions();

    let itemExactMatch;
    let itemPartialMatch;

    if (selectedItem) {
      itemExactMatch = item.find((i) => i.이름 === selectedItem.이름);
      itemPartialMatch = item.find(
        (i) =>
          i.이름.indexOf(selectedItem.이름) !== -1 &&
          i.이름 !== selectedItem.이름
      );
    } else {
      itemExactMatch = item.find((i) => i.이름 === searchItemInput);
      itemPartialMatch = item.find(
        (i) =>
          i.이름.indexOf(searchItemInput) !== -1 && i.이름 !== searchItemInput
      );
    }

    const foundItem = itemExactMatch || itemPartialMatch;
    if (!foundItem) {
      alert("해당 아이템을 찾을 수 없습니다.");
      return;
    } else {
      navigate(`/item/${foundItem.코드}`);
      return;
    }

    // const foundMobs = new Set();
    // mobDropTable.forEach((mob) => {
    //   if (Object.values(mob).some((drop) => drop === foundItem.이름)) {
    //     foundMobs.add(mob);
    //   }
    // });

    // let itemDropMobs = " 해당 아이템을 드랍하는 몬스터가 없습니다.";
    // if (foundMobs.size > 0) {
    //   itemDropMobs = Array.from(foundMobs)
    //     .map((mob) => `[${mob.이름}]`)
    //     .join(", ");
    // }

    // setItemResult({
    //   ...foundItem,
    //   itemDropMobs,
    // });
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchItem();
    }
  };

  return (
    <div id="wrap">
      <h1>아이템</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="ex) 글라디우스"
          value={searchItemInput}
          onKeyDown={handleKeyDown}
          onChange={handleSearch} // 검색어 입력 시 필터링
        />
        <div className="center">
          {showSuggestions && (
            <ul id="suggestions">
              {filteredItems.map((item) => (
                <li
                  key={item.imgCode}
                  onClick={() => handleSuggestionClick(item)}
                >
                  <img
                    className="suggestion-img"
                    src={
                      item.imgCode != 0
                        ? `https://maplestory.io/api/kms/284/item/${item.imgCode}/icon?resize=2`
                        : "https://maplestory.io/api/kms/284/item/4001102/icon?resize=2"
                    }
                    alt="icon"
                  />
                  <label>{item.이름}</label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="container">
        <div>{ItemDetailCard(itemResult)}</div>
      </div>
    </div>
  );
};

export default ItemPage;
