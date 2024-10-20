import React, { useState, useEffect, useCallback } from "react";
import styles from "./UpgradeItemCard.module.css";
import item from "../../../data/item";
import attackSpeeds from "../../../data/attackSpeeds";
import weaponTypes from "../../../data/weaponTypes";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import badWords from "../../../data/badWords";

const UpgradeItemCard = ({ rankingList }) => {
  const [remainingUpgrades, setRemainingUpgrades] = useState(15);
  const [result, setResult] = useState("");
  const [upgradeCount, setUpgradeCount] = useState(0);
  const [itemResult, setItemResult] = useState(null); // itemResult를 상태로 저장
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const foundItem = item.find((i) => i.이름 === "흑갑충");
    setItemResult(foundItem); // itemResult를 상태로 설정
  }, [itemResult]);

  const applyUpgradeCount = () => {
    setUpgradeCount(0);
    setRemainingUpgrades(15);
    setResult("");
  };

  const handleUpgradeResult = (
    resultMessage,
    upgradeCountChange,
    remainingUpgradesChange
  ) => {
    setUpgradeCount(upgradeCount + upgradeCountChange);
    setRemainingUpgrades(remainingUpgrades + remainingUpgradesChange);
    setResult(resultMessage);
  };

  const upgrade = () => {
    if (remainingUpgrades <= 0) {
      setResult(
        <span style={{ color: "red" }}>남은 업그레이드 횟수가 없습니다.</span>
      );
      return;
    }

    let random = Math.random() * 100;

    if (random < 36) {
      handleUpgradeResult(
        <span>
          <span style={{ color: "red" }}>실패 ㅠㅠ </span> 공 +0 업횟{" "}
          <span style={{ color: "red" }}>-1</span>
        </span>,
        0,
        -1
      );
    } else if (random < 86) {
      handleUpgradeResult(
        <span>
          <span style={{ color: "#4caf50" }}>성공! </span> 공{" "}
          <span style={{ color: "#4caf50" }}>+1</span> 업횟{" "}
          <span style={{ color: "red" }}>-1</span>
        </span>,
        1,
        -1
      );
    } else if (random < 96) {
      handleUpgradeResult(
        <span>
          <span style={{ color: "#4caf50" }}>대성공!! </span> 공{" "}
          <span style={{ color: "#4caf50" }}>+1</span> 업횟{" "}
          <span style={{ color: "#4caf50" }}>+0</span>
        </span>,
        1,
        0
      );
    } else if (random < 99) {
      handleUpgradeResult(
        <span>
          <span style={{ color: "#CF61F3" }}>대박!!! </span> 공{" "}
          <span style={{ color: "#4caf50" }}>+1</span> 업횟{" "}
          <span style={{ color: "#4caf50" }}>+1</span>
        </span>,
        1,
        1
      );
    } else {
      handleUpgradeResult(
        <span>
          <span style={{ color: "#FFCC00" }}>초대박!!!! </span> 공{" "}
          <span style={{ color: "#4caf50" }}>+2</span> 업횟{" "}
          <span style={{ color: "#4caf50" }}>+2</span>
        </span>,
        2,
        2
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "R" || event.key === "r") {
      applyUpgradeCount();
    }
    if (event.key === "Q" || event.key === "q") {
      upgrade();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [remainingUpgrades, upgradeCount]);

  const addItemResult = (label, value) => {
    if (value == undefined || value == 0) return "";
    return (
      <p>
        {label}: {value}
      </p>
    );
  };

  const itemNamePlusUpgrade = (itemName, upgrade) => {
    // 0강 7강 12강 16강 20강 25강
    // 흰색 주황 파랑 보라 노랑 초록
    let color;

    if (upgrade > 24) {
      color = "#22B14C";
    } else if (upgrade > 19) {
      color = "#FFCC00";
    } else if (upgrade > 15) {
      color = "#CF61F3";
    } else if (upgrade > 11) {
      color = "#1D2EF3";
    } else if (upgrade > 6) {
      color = "#F37944";
    } else {
      color = "#FFFFFF";
    }

    return (
      <h2 style={{ color: color }}>
        {itemName} (+{upgrade})
      </h2>
    );
  };

  const renderItem = () => {
    if (!itemResult) return <p>아이템 정보를 불러오는 중입니다...</p>;

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
        {itemNamePlusUpgrade(itemResult.이름, upgradeCount)}
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
        {addItemResult("공격력", upgradeCount + itemResult.공격력)}
        {addItemResult("마력", itemResult.마력)}
        {addItemResult("HP", itemResult.HP)}
        {addItemResult("MP", itemResult.MP)}
        {addItemResult("명중률", itemResult.명중률)}
        {addItemResult("회피율", itemResult.회피율)}
        {addItemResult("이동 속도", itemResult.이동속도)}
        <p className="single-line"></p>
        <p>판매비용: {itemResult.판매비용.toLocaleString("ko-KR")}</p>
        <p className="single-line"></p>
        <p>강화 가능 횟수: {remainingUpgrades}</p>
      </div>
    );
  };

  // 비속어를 "어머"로 대체하는 함수
  const replaceBadWords = (text) => {
    let sanitizedText = text;
    badWords.forEach((obj) => {
      const word = obj.badWords;
      const regex = new RegExp(`${word}`, "gi");
      sanitizedText = sanitizedText.replace(regex, "어머"); // 비속어를 "어머"로 대체
    });
    return sanitizedText;
  };

  function checkNickName(str) {
    var sqlArray = new Array(
      "SELECT",
      "INSERT",
      "DELETE",
      "UPDATE",
      "CREATE",
      "DROP",
      "EXEC",
      "UNION",
      "FETCH",
      "DECLARE",
      "TRUNCATE"
    );

    var regex;
    for (var i = 0; i < sqlArray.length; i++) {
      regex = new RegExp(sqlArray[i], "gi");

      if (regex.test(str)) {
        // alert("[" + sqlArray[i] + "]와(과)같은 특정문자로 검색할 수 없습니다.");
        return false;
      }
    }
    return true;
  }

  const handleRankRegistration = async () => {
    if (remainingUpgrades > 0) {
      alert("업그레이드를 모두 사용해야 랭킹에 등록할 수 있습니다.");
      return;
    }

    if (isButtonDisabled) return;

    // 현재 랭킹 확인
    const lowestRank = rankingList[rankingList.length - 1];

    // 버튼 비활성화
    setIsButtonDisabled(true);

    // 1초 후 버튼 다시 활성화
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);

    if (lowestRank) {
      // 랭킹이 있을 경우
      if (rankingList.length < 10 || upgradeCount >= lowestRank.upgradeCount) {
        if (!checkNickName(nickname)) return;

        await registerRank(); // 랭킹 등록 로직 호출
      } else {
        alert(
          "랭킹 등록 기준을 충족하지 못했습니다. 최소 " +
            lowestRank.upgradeCount +
            "강 이상이어야 합니다."
        );
      }
    } else {
      // 랭킹이 없을 경우 무조건 등록 가능
      if (!checkNickName(nickname)) return;

      await registerRank(); // 랭킹 등록 로직 호출
      alert("랭킹에 등록되었습니다!");
    }
  };

  const registerRank = async () => {
    // 랭킹 등록
    const db = getFirestore();
    const newRanking = {
      nickname: replaceBadWords(nickname),
      upgradeCount: upgradeCount,
      timestamp: new Date(), // 현재 시간 등록
    };
    try {
      await addDoc(collection(db, "rankings"), newRanking);
      alert("랭킹에 등록되었습니다!");
      window.location.reload(); // 랭킹 등록 후 새로 고침
    } catch (error) {
      alert("랭킹 등록 중 오류가 발생했습니다.");
    }
  };

  const checkSearchedWord = useCallback((event) => {
    var expText = /[%=*><]/;
    if (expText.test(event.key) == true) {
      alert("보안: 특수문자(%,=,*,>,<)는 입력 할수 없습니다.");
      event.preventDefault();
    }
  }, []);

  return (
    <div className={styles["div-flex"]}>
      <div className="center">{renderItem()}</div>
      <label className={styles["upgrade-label"]}>{result}</label>
      <div className="center">
        <label className={styles["reset-button"]} onClick={applyUpgradeCount}>
          🔄
        </label>
        <label className={styles["upgrade-button"]} onClick={upgrade}>
          강화
        </label>
      </div>
      <div className="center">
        {remainingUpgrades === 0 && (
          <div className={styles["div-flex-row"]}>
            <input
              maxlength="11"
              onKeyDown={checkSearchedWord}
              className={styles["nickname-input"]}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
            <button
              className={styles["rank-button"]}
              onClick={handleRankRegistration}
              disabled={!nickname || isButtonDisabled}
            >
              등록
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeItemCard;
