import mobInfo from "../../data/mobInfo";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 import
import "./ScrollPage.css";
import scrollType from "../../data/scrollType";
import MobCard from "../../components/Card/MobCard/MobCard"; // MobCard import

const SearchScroll = () => {
  const [scroll, setScroll] = useState(""); // 주문서 입력 상태
  const [mobsWithScroll, setMobsWithScroll] = useState([]); // 필터링된 몹 목록 상태
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 생성

  const searchScroll = () => {
    const filteredMobs = mobInfo
      .filter((mob) => {
        // scroll의 실제 이름을 가져온다
        const actualScrollName = scrollType[scroll]; // "아대 공격력" 또는 "아대 공격력"

        // mob.주문서에서 각 축약형을 확인
        return Object.keys(scrollType).some((key) => {
          // mob.주문서가 key와 같거나, actualScrollName이 포함되는지 확인
          return (
            mob.주문서 &&
            mob.주문서.includes(key) &&
            actualScrollName &&
            actualScrollName.includes(scrollType[key])
          );
        });
      })
      .map((mob) => mob.이름);

    setMobsWithScroll(filteredMobs); // 상태 업데이트
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchScroll();
    }
  };

  const handleMobClick = (mobName) => {
    navigate(`/mob/${mobName}`); // 몬스터 이름에 따라 페이지 이동
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

      {/* <div className="container"> */}
      <div className="scroll-page-container">
        {scroll.length > 0 && mobsWithScroll.length > 0 ? ( // scroll이 비어있지 않고 mobsWithScroll이 존재할 때
          <div>
            {scroll.length === 0 ? null : <h2 className="p">드랍 몬스터</h2>}
            <div className="scroll-page-container-row">
              {mobsWithScroll.map((mobName) => {
                const mob = mobInfo.find((mob) => mob.이름 === mobName); // mobInfo에서 해당 몬스터 정보를 찾음
                return (
                  <MobCard
                    key={mobName}
                    mob={mob}
                    onClick={() => handleMobClick(mobName)} // MobCard 클릭 시 이동
                  />
                );
              })}
            </div>
          </div>
        ) : // scroll이 비어있거나 mobsWithScroll이 없을 경우
        scroll.length === 0 ? null : (
          <p className="p">해당 주문서를 찾을 수 없습니다.</p>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default SearchScroll;
