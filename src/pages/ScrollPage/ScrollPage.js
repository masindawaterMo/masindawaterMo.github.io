import mobInfo from "../../data/mobInfo";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScrollPage.css";
import scrollType from "../../data/scrollType";
import MobCard from "../../components/Card/MobCard/MobCard";

const SearchScroll = () => {
  const [scroll, setScroll] = useState("");
  const [mobsWithScroll, setMobsWithScroll] = useState([]);
  const navigate = useNavigate();

  const searchScroll = () => {
    const filteredMobs = mobInfo
      .filter((mob) => {
        const actualScrollName = scrollType[scroll];
        return Object.keys(scrollType).some((key) => {
          return (
            mob.주문서 &&
            mob.주문서.split("/").some((item) => item.trim() === key) && // 정확한 일치 여부 확인
            actualScrollName === scrollType[key] // 정확히 일치하는 scrollType 확인
          );
        });
      })
      .sort((a, b) => a.레벨 - b.레벨) // 레벨 기준 오름차순 정렬
      .map((mob) => mob.이름);

    setMobsWithScroll(filteredMobs);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchScroll();
    }
  };

  const handleMobClick = (mobName) => {
    navigate(`/mob/${mobName}`);
  };

  return (
    <div id="wrap">
      <h1>주문서</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          value={scroll}
          onChange={(e) => setScroll(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ex)장공 ex2)활"
        />
      </div>

      <div className="scroll-page-container">
        {scroll.length > 0 && mobsWithScroll.length > 0 ? (
          <div>
            <h2 className="p">드랍 몬스터</h2>
            <div className="scroll-page-container-row">
              {mobsWithScroll.map((mobName) => {
                const mob = mobInfo.find((mob) => mob.이름 === mobName);
                return (
                  <MobCard
                    key={mobName}
                    mob={mob}
                    onClick={() => handleMobClick(mobName)}
                  />
                );
              })}
            </div>
          </div>
        ) : scroll.length === 0 ? null : (
          <h2 className="p">해당 주문서를 찾을 수 없습니다.</h2>
        )}
      </div>
    </div>
  );
};

export default SearchScroll;
