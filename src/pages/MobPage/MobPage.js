import React, { useState } from "react";
import mobDropTable from "../../data/mobDropTable";
import mob from "../../data/mobInfo";
import "./MobPage.css";

const MobPage = () => {
  const [searchMobInput, setSearchMobInput] = useState("");
  const [mobResult, setMobResult] = useState(null);
  const [filteredMobs, setFilteredMobs] = useState([]); // 추천 검색어 상태
  const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 창 표시 여부
  const [drops, setDrops] = useState("");
  // 검색어 입력 시 실행되는 함수
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchMobInput(searchValue);

    if (searchValue) {
      const filtered = mob.filter((i) =>
        i.이름.toLowerCase().startsWith(searchValue)
      );
      setFilteredMobs(filtered); // 필터링된 아이템 상태 업데이트
      setShowSuggestions(filtered.length > 0); // 필터링된 아이템이 있을 경우 추천 창 표시
    } else {
      setShowSuggestions(false); // 검색어가 없을 경우 추천 창 숨김
    }
  };

  // 추천 검색어 클릭 시 실행되는 함수
  const handleSuggestionClick = (selectedMob) => {
    setSearchMobInput(selectedMob.이름); // 선택된 추천어를 검색어로 설정
    searchMob(selectedMob); // 선택된 아이템으로 검색 실행
    closeSuggestions(); // 추천 창 닫기
  };

  // 추천 창 닫기
  const closeSuggestions = () => {
    setFilteredMobs([]); // 추천어 리스트 비우기
    setShowSuggestions(false); // 추천 창 숨기기
  };

  // 검색 실행
  const searchMob = (selectedMob) => {
    closeSuggestions();

    let mobExactMatch;
    let mobPartialMatch;

    if (selectedMob) {
      mobExactMatch = mob.find((i) => i.이름 === selectedMob.이름);
      mobPartialMatch = mob.find(
        (i) =>
          i.이름.indexOf(selectedMob.이름) !== -1 && i.이름 !== selectedMob.이름
      );
    } else {
      mobExactMatch = mob.find((i) => i.이름 === searchMobInput);
      mobPartialMatch = mob.find(
        (i) =>
          i.이름.indexOf(searchMobInput) !== -1 && i.이름 !== searchMobInput
      );
    }

    const foundMob = mobExactMatch || mobPartialMatch;
    if (!foundMob) {
      alert("해당 몬스터를 찾을 수 없습니다.");
      return;
    }

    const foundDropTable = mobDropTable.find((i) => i.이름 === foundMob.이름);

    let dropsContent = ""; // dropsContent 초기화

    if (foundDropTable) {
      for (let key in foundDropTable) {
        if (
          key !== "이름" &&
          foundDropTable[key] !== "-" &&
          foundDropTable[key] !== 0.0
        ) {
          if (key.startsWith("drop")) {
            dropsContent += ` ${foundDropTable[key]}`;
          } else if (key.startsWith("probability")) {
            dropsContent += `(${
              Math.round((foundDropTable[key] / 4) * 100 * 10000000) / 10000000
            }%)/

            `;
          }
        }
      }
    }

    dropsContent = dropsContent.slice(0, -1);

    if (dropsContent === "") {
      dropsContent = "드랍 아이템 : X";
    }

    setDrops(dropsContent);

    setMobResult({
      ...foundMob,
    });
  };

  function addField(label, value, cssClass = "") {
    return value !== undefined && value !== null ? (
      <p className={cssClass}>
        {label}: {value}
      </p>
    ) : (
      <p className={cssClass}>{label}: 제보 바람</p>
    );
  }

  const addMopType = (result) => {
    let mopType = ``;

    mopType += findMopType(result, "힐");
    mopType += findMopType(result, "성");
    mopType += findMopType(result, "얼", "음");
    mopType += findMopType(result, "전", "기");
    mopType += findMopType(result, "불");
    mopType += findMopType(result, "독");

    return mopType !== `` ? <p>속성: {mopType.slice(0, -1)}</p> : ``;
  };

  function findMopType(result, type, tail = "") {
    const value = result[type];
    let content = "";
    if (value === 1) {
      if (type === "힐") {
        content += ` 힐 공격 가능/`;
      } else {
        content += `${type}${tail} 약점/`;
      }
    }

    if (value === 2) {
      content += `${type}${tail} 반감/`;
    }

    return content;
  }

  const renderMob = () => {
    if (!mobResult) return null;

    return (
      <div className="mob-detail-card-container">
        <div className="center">
          <img
            className="mob-detail-card-img"
            src={`https://maplestory.io/api/kms/284/mob/animated/${mobResult.mobCode}/move`}
            alt="Mob"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://maplestory.io/api/kms/284/mob/${mobResult.mobCode}/icon?resize=2`;
            }}
          />
        </div>
        <h2>{mobResult.이름}</h2>
        {addField("LV", mobResult.레벨, "center")}
        {addField("HP", mobResult.HP)}
        {addField("공격력", mobResult.공격력)}
        {addField("회피율", mobResult.회피율)}
        {addMopType(mobResult)}
        <p className="single-line"></p>
        {addField("경험치", mobResult.경험치)}
        {addField("메소", mobResult.메소)}
        {addField("주문서", mobResult.주문서)}
        {addField("추천 사냥터", mobResult["추천 사냥터"])}
        <p className="single-line"></p>
        {drops.split("/").map((drop, index) => (
          <p key={index}>{drop}</p>
        ))}
        <p className="single-line"></p>
      </div>
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMob();
    }
  };

  return (
    <div id="wrap">
      <h1>몬스터</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="ex) 주니어 발록"
          value={searchMobInput}
          onKeyDown={handleKeyDown}
          onChange={handleSearch} // 검색어 입력 시 필터링
        />
        <div className="center">
          {showSuggestions && (
            <ul id="suggestions">
              {filteredMobs.map((mob) => (
                <li
                  key={mob.mobCode}
                  onClick={() => handleSuggestionClick(mob)}
                >
                  <img
                    className="suggestion-img"
                    src={
                      mob.mobCode !== 0
                        ? `https://maplestory.io/api/kms/284/mob/${mob.mobCode}/icon?resize=1`
                        : "https://maplestory.io/api/kms/284/mob/4001102/icon?resize=1"
                    }
                    alt="icon"
                  />
                  <label>{mob.이름}</label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="container">
        <div>{renderMob()}</div>
      </div>
    </div>
  );
};

export default MobPage;
