import mobInfo from "../../data/mobInfo";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ScrollPage.css";
import scrollType from "../../data/scrollType";
import MobCard from "../../components/Card/MobCard/MobCard";
import ScrollCard from "../../components/Card/ScrollCard/ScrollCard";

const SearchScroll = () => {
  const [scroll, setScroll] = useState("");
  const [mobsWithScroll, setMobsWithScroll] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const { scrollName } = useParams();

  // mobName 변경 시 mobResult 상태 업데이트
  useEffect(() => {
    if (!scrollName) {
      setMobsWithScroll([]);
      setScroll("");
      return;
    }

    setScroll(scrollName);
    searchScroll(scrollName);
  }, [scrollName]);

  const searchScroll = (scrollValue) => {
    const filteredMobs = mobInfo
      .filter((mob) => {
        const actualScrollName = scrollType[scrollValue];
        return Object.keys(scrollType).some((key) => {
          return (
            mob.주문서 &&
            mob.주문서.split("/").some((item) => item.trim() === key) &&
            actualScrollName === scrollType[key]
          );
        });
      })
      .sort((a, b) => a.레벨 - b.레벨)
      .map((mob) => mob.이름);

    setMobsWithScroll(filteredMobs);
    setIsSearching(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchScroll(scroll);
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
        {isSearching && scroll.length > 0 && mobsWithScroll.length > 0 ? (
          <div>
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
        ) : (
          <div className="scroll-page-container-row">
            {[
              ...new Map(
                Object.entries(scrollType)
                  .filter(([, value]) => value !== "X") // "X" 제외
                  .map(([key, value]) => [value, key]) // value를 키로, key를 값으로
              ).values(),
            ] // 중복된 value는 하나만 남음
              .map((scroll, index) => (
                <ScrollCard scroll={scroll} index={index} key={scroll} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScroll;
