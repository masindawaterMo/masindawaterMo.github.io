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
  const [visibleCount, setVisibleCount] = useState(40); // 한 번에 렌더링할 몬스터 수
  const [levelRange, setLevelRange] = useState([1, 200]); // 레벨 범위 필터
  const [mobType, setMobType] = useState("all"); // 몹 타입 필터
  const [region, setRegion] = useState("all"); // 지역 필터
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
        i?.이름?.toLowerCase().startsWith(searchValue)
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

  const getFilteredMobs = () => {
    return mobInfo
      .filter((mob) => {
        const matchesLevel =
          mob.레벨 >= levelRange[0] && mob.레벨 <= levelRange[1];
        const matchesType =
          mobType === "all" ||
          (mobType === "normal" && !mob.보스) || // 일반 몹
          (mobType === "boss" && mob.보스 === "O"); // 보스 몹
        const matchesRegion = region === "all" || mob.지역 === region;

        return matchesLevel && matchesType && matchesRegion;
      })
      .filter((mob) => mob.이름 && mob.레벨 && mob.HP)
      .sort((a, b) => a.레벨 - b.레벨)
      .slice(0, visibleCount);
  };

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
        <div className={styles["filters-mobile-container"]}>
          {/* 필터링 섹션 */}
          <div className={styles.filters}>
            {/* 레벨 범위 선택 */}
            <label>
              LV :&nbsp;&nbsp;
              <input
                style={{ width: "70px" }}
                type="number"
                value={levelRange[0] === 0 ? "" : levelRange[0]}
                onChange={(e) =>
                  setLevelRange([Number(e.target.value), levelRange[1]])
                }
              />
              &nbsp;&nbsp;~&nbsp;&nbsp;
              <input
                style={{ width: "70px" }}
                type="number"
                value={levelRange[1] === 0 ? "" : levelRange[1]}
                onChange={(e) =>
                  setLevelRange([levelRange[0], Number(e.target.value)])
                }
              />
            </label>

            {/* 지역 선택 */}
            <label>
              지역 :&nbsp;&nbsp;
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="all">모든 지역</option>
                <option value="빅토리아">빅토리아</option>
                <option value="오르비스">오르비스</option>
                <option value="엘나스">엘나스</option>
                <option value="루디브리엄">루디브리엄</option>
                <option value="지구방위본부">지구방위본부</option>
                <option value="아랫마을">아랫마을</option>
                <option value="아쿠아리움">아쿠아리움</option>
                <option value="리프레">리프레</option>
                <option value="엘린숲">엘린숲</option>
                <option value="니할사막">니할사막</option>
                <option value="무릉도원">무릉도원</option>
                <option value="시간의신전">시간의신전</option>
                <option value="코크타운">코크타운</option>
                <option value="대만">대만</option>
                <option value="중국">중국</option>
                <option value="일본">일본</option>
                <option value="태국">태국</option>
              </select>
            </label>

            {/* 몹 타입 선택 */}
            <label>
              구분 :&nbsp;&nbsp;
              <select
                value={mobType}
                onChange={(e) => setMobType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="normal">일반</option>
                <option value="boss">보스</option>
              </select>
            </label>
          </div>
          <div className={styles["container"]}>
            <div className={styles["row"]}>
              {getFilteredMobs().map((mob, i) => (
                <MobCard mob={mob} i={i} key={mob.이름} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobPage;
