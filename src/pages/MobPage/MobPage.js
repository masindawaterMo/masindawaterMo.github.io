import React, { useState, useEffect } from "react";
import mobInfo from "../../data/mobInfo";
import styles from "./MobPage.module.css";
import MobDetailCard from "../../components/Card/MobDetailCard/MobDetailCard";
import { useParams, useNavigate } from "react-router-dom";
import MobCard from "../../components/Card/MobCard/MobCard";

const MobPage = () => {
  const [searchMobInput, setSearchMobInput] = useState("");
  const [mobResult, setMobResult] = useState(null);
  const [filteredMobs, setFilteredMobs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20); // 한 번에 렌더링할 몬스터 수
  const { mobName } = useParams();
  const navigate = useNavigate();

  // mobName 변경 시 mobResult 상태 업데이트
  useEffect(() => {
    if (!mobName) {
      setMobResult(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const foundMob = mobInfo.find((i) => i.이름 === mobName);

    if (!foundMob) {
      alert("해당 몬스터를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    setSearchMobInput(foundMob.이름);
    setMobResult({ ...foundMob });
    setIsLoading(false);
  }, [mobName]);

  // 검색어 입력 시 실행되는 함수
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchMobInput(searchValue);

    if (searchValue) {
      const filtered = mobInfo.filter((i) =>
        i.이름.toLowerCase().startsWith(searchValue)
      );
      setFilteredMobs(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (selectedMob) => {
    setSearchMobInput(selectedMob.이름);
    searchMob(selectedMob);
    closeSuggestions();
  };

  const closeSuggestions = () => {
    setFilteredMobs([]);
    setShowSuggestions(false);
  };

  const searchMob = (selectedMob) => {
    closeSuggestions();

    let foundMob;
    if (selectedMob) {
      foundMob = mobInfo.find((i) => i.이름 === selectedMob.이름);
    } else {
      foundMob = mobInfo.filter(
        (i) => i.이름 && i.이름.startsWith(searchMobInput)
      )[0];
    }

    if (!foundMob) {
      alert("해당 몬스터를 찾을 수 없습니다.");
      return;
    } else {
      navigate(`/mob/${foundMob.이름}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMob();
    }
  };

  // 스크롤이 하단에 도달했을 때 더 많은 MobCard를 로드하는 함수
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      setVisibleCount((prevCount) => prevCount + 20); // 한 번에 20개씩 추가 로드
    }
  };

  // 무한 스크롤 이벤트 추가
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div id="wrap">
      <h1>몬스터</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="ex) 주니어 발록"
          value={searchMobInput}
          onKeyDown={handleKeyDown}
          onChange={handleSearch}
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
                    src={`https://maplestory.io/api/kms/284/mob/${mob.mobCode}/icon?resize=2`}
                    onError={(e) => {
                      e.target.src = `https://maplestory.io/api/TMS/209/mob/${mob.mobCode}/icon?resize=2`;
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

      {/* 몬스터 상세 정보가 있으면 MobDetailCard를 렌더링 */}
      {mobResult ? (
        <MobDetailCard mobResult={mobResult} />
      ) : (
        <div className={styles["container"]}>
          <div className={styles["row"]}>
            {mobInfo
              .filter((mob) => mob.이름 && mob.레벨 && mob.HP)
              .sort((a, b) => a.레벨 - b.레벨)
              .slice(0, visibleCount) // visibleCount까지의 몬스터만 표시
              .map((mob, i) => (
                <MobCard mob={mob} i={i} key={mob.이름} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobPage;
