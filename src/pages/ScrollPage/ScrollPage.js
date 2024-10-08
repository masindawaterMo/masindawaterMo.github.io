import mobInfo from "../../data/mobInfo";
import React, { useState } from "react";
import "./ScrollPage.css";

const SearchScroll = () => {
  const [scroll, setScroll] = useState(""); // 주문서 입력 상태
  const [mobsWithScroll, setMobsWithScroll] = useState([]); // 필터링된 몹 목록 상태

  const searchScroll = () => {
    const filteredMobs = mobInfo
      .filter((mob) => mob.주문서 && mob.주문서.includes(scroll)) // 조건을 만족하는 몹 필터링
      .map((mob) => mob.이름);

    setMobsWithScroll(filteredMobs); // 상태 업데이트
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchScroll();
    }
  };

  return (
    <div id="wrap">
      <h1>주문서</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          value={scroll}
          onChange={(e) => setScroll(e.target.value)} // 입력값 변경 시 상태 업데이트
          onKeyDown={handleKeyDown}
          placeholder="ex)장공 ex2)활"
        />
      </div>

      <div className="container">
        {mobsWithScroll.length > 0 ? (
          <div>
            <p className="p">드랍 몬스터: {mobsWithScroll.join(", ")}</p>
          </div>
        ) : (
          <p className="p">해당 주문서를 찾을 수 없습니다.</p> // 몹 목록이 없을 경우 메시지 표시
        )}
      </div>
    </div>
  );
};

export default SearchScroll;
