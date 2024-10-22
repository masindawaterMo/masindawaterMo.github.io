import item from "../../data/item";
import React, { useState, useEffect } from "react";
import mobDropTable from "../../data/mobDropTable";
import attackSpeeds from "../../data/attackSpeeds";
import weaponTypes from "../../data/weaponTypes";
import "./ItemPage.css";
import { useParams } from "react-router-dom";

const ItemPage = () => {
  const [searchItemInput, setSearchItemInput] = useState("");
  const [itemResult, setItemResult] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]); // 추천 검색어 상태
  const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 창 표시 여부
  const { itemId } = useParams(); // URL에서 아이템 ID 가져오기

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
    }

    const foundMobs = new Set();
    mobDropTable.forEach((mob) => {
      if (Object.values(mob).some((drop) => drop === foundItem.이름)) {
        foundMobs.add(mob);
      }
    });

    let itemDropMobs = " 해당 아이템을 드랍하는 몬스터가 없습니다.";
    if (foundMobs.size > 0) {
      itemDropMobs = Array.from(foundMobs)
        .map((mob) => `[${mob.이름}]`)
        .join(", ");
    }

    setItemResult({
      ...foundItem,
      itemDropMobs,
    });
  };

  const addItemResult = (label, value) => {
    if (value == undefined || value == 0) return "";

    return (
      <p>
        {label}: {value}
      </p>
    );
  };

  const renderItem = () => {
    if (!itemResult) return null;

    return (
      <div className="item-detail-card-container">
        <div className="center">
          <img
            className="item-detail-card-img"
            src={
              itemResult.imgCode != 0
                ? `https://maplestory.io/api/kms/284/item/${itemResult.imgCode}/icon?resize=2`
                : "https://maplestory.io/api/kms/284/item/4001102/icon?resize=2"
            }
            alt="Item"
          />
        </div>
        <h2>{itemResult.이름}</h2>
        <p className="single-line"></p>

        <p>LV: {itemResult["필요 레벨"]}</p>
        <p>종류: {weaponTypes[itemResult.종류]}</p>
        <p>직업: {itemResult.직업}</p>
        <p className="single-line"></p>
        <p>REQ STR: {itemResult.필요STR}</p>
        <p>REQ DEX: {itemResult.필요DEX}</p>
        <p>REQ INT: {itemResult.필요INT}</p>
        <p>REQ LUK: {itemResult.필요LUK}</p>
        <p className="single-line"></p>

        {addItemResult("STR", itemResult.STR)}
        {addItemResult("DEX", itemResult.DEX)}
        {addItemResult("INT", itemResult.INT)}
        {addItemResult("LUK", itemResult.LUK)}

        {addItemResult("공격 속도", attackSpeeds[itemResult.공격속도])}
        {addItemResult("공격력", itemResult.공격력)}
        {addItemResult("마력", itemResult.마력)}
        {addItemResult("HP", itemResult.HP)}
        {addItemResult("MP", itemResult.MP)}
        {addItemResult("명중률", itemResult.명중률)}
        {addItemResult("회피율", itemResult.회피율)}
        {addItemResult("이동 속도", itemResult.이동속도)}
        <p className="single-line"></p>

        <p>판매비용: {itemResult.판매비용.toLocaleString("ko-KR")}</p>
        <p className="single-line"></p>
        <p>드랍 몬스터: {itemResult.itemDropMobs}</p>
      </div>
    );
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
                        ? `https://maplestory.io/api/kms/284/item/${item.imgCode}/icon?resize=1`
                        : "https://maplestory.io/api/kms/284/item/4001102/icon?resize=1"
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
        <div>{renderItem()}</div>
      </div>
    </div>
  );
};

export default ItemPage;
