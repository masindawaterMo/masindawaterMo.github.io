import React, { useState } from "react";
import mob from "../../data/mobInfo";
import "./MobPage.css";
import MobDetailCard from "../../components/Card/MobDetailCard/MobDetailCard";

const MobPage = () => {
  const [searchMobInput, setSearchMobInput] = useState("");
  const [mobResult, setMobResult] = useState(null);
  const [filteredMobs, setFilteredMobs] = useState([]); // 추천 검색어 상태
  const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 창 표시 여부

  // 검색어 입력 시 실행되는 함수
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchMobInput(searchValue);

    if (searchValue) {
      const filtered = mob.filter((i) => {
        if (i.이름) return i.이름.toLowerCase().startsWith(searchValue);
      });
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
      mobExactMatch = mob.find((i) => {
        if (i.이름) return i.이름 === selectedMob.이름;
      });

      mobPartialMatch = mob.find((i) => {
        if (i.이름)
          return (
            i.이름.indexOf(selectedMob.이름) !== -1 &&
            i.이름 !== selectedMob.이름
          );
      });
    } else {
      mobExactMatch = mob.find((i) => {
        if (i.이름) return i.이름 === searchMobInput;
      });
      mobPartialMatch = mob.find((i) => {
        if (i.이름)
          return (
            i.이름.indexOf(searchMobInput) !== -1 && i.이름 !== searchMobInput
          );
      });
    }

    const foundMob = mobExactMatch || mobPartialMatch;
    if (!foundMob) {
      alert("해당 몬스터를 찾을 수 없습니다.");
      return;
    }

    setMobResult({
      ...foundMob,
    });
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
                        : "https://maplestory.io/api/kms/284/mob/1210102/icon?resize=1"
                    }
                    onError={(e) => {
                      e.target.src = `https://maplestory.io/api/TMS/209/mob/${mob.mobCode}/icon?resize=1`;
                    }}
                    alt="icon"
                  />
                  <label>{mob.이름}</label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>{mobResult && <MobDetailCard mobResult={mobResult} />}</div>
    </div>
  );
};

export default MobPage;
