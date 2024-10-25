import React, { useState, useEffect } from "react";
import mobInfo from "../../data/mobInfo";
import styles from "./MobPage.module.css";
import MobDetailCard from "../../components/Card/MobDetailCard/MobDetailCard";
import { useParams, useNavigate } from "react-router-dom";
import MobCard from "../../components/Card/MobCard/MobCard";

const MobPage = () => {
  const [searchMobInput, setSearchMobInput] = useState("");
  const [mobResult, setMobResult] = useState(null);
  const [filteredMobs, setFilteredMobs] = useState([]); // 추천 검색어 상태
  const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 창 표시 여부
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const { mobName } = useParams(); // URL에서 몬스터 이름 가져오기
  const navigate = useNavigate();

  // mobName 변경 시에 따라 mobResult 상태를 업데이트
  useEffect(() => {
    if (!mobName) {
      // URL에 mobName이 없으면 mobResult를 초기화
      setMobResult(null);
      setIsLoading(false); // 로딩 종료
      return;
    }

    setIsLoading(true); // 로딩 시작

    const foundMob = mobInfo.find((i) => i.이름 === mobName);

    if (!foundMob) {
      alert("해당 몬스터를 찾을 수 없습니다.");
      setIsLoading(false); // 로딩 종료
      return;
    }

    setSearchMobInput(foundMob.이름);
    setMobResult({ ...foundMob });
    setIsLoading(false); // 로딩 종료
  }, [mobName]); // mobName이 변경될 때마다 실행

  // 검색어 입력 시 실행되는 함수
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchMobInput(searchValue);

    if (searchValue) {
      const filtered = mobInfo.filter((i) => {
        if (i.이름) return i.이름.toLowerCase().startsWith(searchValue);
      });
      setFilteredMobs(filtered); // 필터링된 몬스터 상태 업데이트
      setShowSuggestions(filtered.length > 0); // 필터링된 몬스터가 있을 경우 추천 창 표시
    } else {
      setShowSuggestions(false); // 검색어가 없을 경우 추천 창 숨김
    }
  };

  const handleSuggestionClick = (selectedMob) => {
    setSearchMobInput(selectedMob.이름); // 선택된 추천어를 검색어로 설정
    searchMob(selectedMob); // 선택된 몬스터로 검색 실행
    closeSuggestions(); // 추천 창 닫기
  };

  const closeSuggestions = () => {
    setFilteredMobs([]); // 추천어 리스트 비우기
    setShowSuggestions(false); // 추천 창 숨기기
  };

  const searchMob = (selectedMob) => {
    closeSuggestions();

    let foundMob;
    if (selectedMob) {
      foundMob = mobInfo.find((i) => i.이름 === selectedMob.이름);
    } else {
      // 현재 searchMobInput으로 시작하는 몬스터 찾기
      foundMob = mobInfo.filter(
        (i) => i.이름 && i.이름.startsWith(searchMobInput)
      )[0];
    }

    // foundMob의 길이를 확인하여 에러 방지
    if (foundMob.length === 0) {
      alert("해당 몬스터를 찾을 수 없습니다.");
      return;
    } else {
      navigate(`/mob/${foundMob.이름}`); // 첫 번째 몬스터로 이동
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMob();
    }
  };

  // 로딩 상태에 따라 렌더링
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중 표시
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
          {/* 몬스터 이름이 없을 때만 MobCard 목록을 표시 */}
          <div className={styles["row"]}>
            {mobInfo
              .filter((mob) => mob.이름 && mob.레벨 && mob.HP) // 이름과 레벨이 있는 몬스터만 필터링
              .sort((a, b) => a.레벨 - b.레벨) // 레벨 기준으로 정렬
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
