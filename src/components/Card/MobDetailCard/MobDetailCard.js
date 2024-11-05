import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MobDetailCard.module.css";
import mobDropTable from "../../../data/mobDropTable";
import item from "../../../data/item";
import scrollType from "../../../data/scrollType";

const MobDetailCard = ({ mobResult }) => {
  const [errorCount, setErrorCount] = useState(0);
  const errorCountRef = useRef(errorCount); // 최신 상태를 추적하기 위한 useRef
  const [drops, setDrops] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (mobResult) {
      const foundDropTable = mobDropTable.find(
        (i) => i.이름 === mobResult.이름
      );

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
                Math.round((foundDropTable[key] / 4) * 100 * 10000000) /
                10000000
              }%)/`;
            }
          }
        }
      }

      dropsContent = dropsContent.slice(0, -1);

      if (dropsContent === "") {
        dropsContent = "드랍 아이템 : X";
      }

      setDrops(dropsContent);
    }
  }, [mobResult]);

  const handleImgError = (e) => {
    errorCountRef.current += 1; // useRef로 최신 상태 업데이트
    setErrorCount(errorCountRef.current);

    if (errorCountRef.current === 1) {
      e.target.src = `https://maplestory.io/api/kms/284/mob/${mobResult.mobCode}/icon?resize=2`;
    } else if (errorCountRef.current === 2) {
      e.target.src = `https://maplestory.io/api/TMS/209/mob/animated/${mobResult.mobCode}/move`;
    } else if (errorCountRef.current === 3) {
      e.target.src = `https://maplestory.io/api/JMS/419/mob/animated/${mobResult.mobCode}/move`;
    } else if (errorCountRef.current === 4) {
      e.target.src = `https://maplestory.io/api/TMS/209/mob/${mobResult.mobCode}/icon?resize=2`;
    } else {
      e.target.onerror = null;
      e.target.src = `https://maplestory.io/api/kms/284/mob/1210102/icon?resize=1`;
    }
  };

  function addField(label, value, cssClasses = []) {
    const appliedClasses =
      Array.isArray(cssClasses) && cssClasses.length > 0
        ? cssClasses.map((cls) => styles[cls]).join(" ")
        : "";

    return value !== undefined && value !== null ? (
      <div className={appliedClasses}>
        {label}: {value}
      </div>
    ) : (
      <div className={appliedClasses}>{label}: 제보 바람</div>
    );
  }

  const addMopType = (result) => {
    let mopType = [];

    mopType.push(findMopType(result, "힐", "", "#54b528")); // 힐은 초록색
    mopType.push(findMopType(result, "성", "", "white")); // 성은 흰색
    mopType.push(findMopType(result, "얼", "음", "#31AFE0")); // 얼음은 청록색
    mopType.push(findMopType(result, "전", "기", "yellow")); // 전기는 노란색
    mopType.push(findMopType(result, "불", "", "red")); // 불은 빨간색
    mopType.push(findMopType(result, "독", "", "green")); // 독은 초록색

    mopType = mopType.filter(Boolean); // 빈 값을 필터링합니다.

    return mopType.length > 0 ? (
      <>
        <label>속성: {mopType}</label>
        <br />
      </>
    ) : (
      ``
    );
  };

  function findMopType(result, type, tail = "", color = "") {
    const value = result[type];
    let content = null; // JSX를 반환할 내용

    if (value === 1) {
      if (type === "힐") {
        // 힐은 약점 텍스트 없이 표시
        content = (
          <span>
            <span style={{ color }}>{`힐`}</span> {/* 힐은 지정된 색상 */}
            <span style={{ color: "gray" }}> O </span>
          </span>
        );
      } else {
        content = (
          <span>
            <span style={{ color }}>{`${type}${tail}`}</span>{" "}
            {/* 타입은 지정된 색상 */}
            <span style={{ color: "gray" }}> 약점 </span> {/* 기본 색상 유지 */}
          </span>
        );
      }
    }

    if (value === 2) {
      content = (
        <span>
          <span style={{ color }}>{`${type}${tail}`}</span>{" "}
          {/* 타입은 지정된 색상 */}
          <span style={{ color: "gray" }}> 반감 </span> {/* 기본 색상 유지 */}
        </span>
      );
    }

    return content; // JSX 반환
  }

  function itemImg(itemName) {
    const thisItem = item.find((i) => i.이름 === itemName);

    return thisItem && thisItem.imgCode != 0
      ? `https://maplestory.io/api/kms/284/item/${thisItem.imgCode}/icon?resize=4`
      : "https://maplestory.io/api/kms/284/item/4001102/icon?resize=4";
  }

  const handleItemClick = (itemName) => {
    const thisItem = item.find((i) => i.이름 === itemName);
    if (thisItem) navigate(`/item/${thisItem.코드}`); // 아이템 ID를 URL로 전달
  };

  return (
    <div className={styles["mob-detail-card-container"]}>
      <div className={styles["mob-detail-card-row1"]}>
        <div className={styles["mob-detail-img-container"]}>
          <img
            src={`https://maplestory.io/api/kms/284/mob/animated/${mobResult.mobCode}/move`}
            alt="Mob"
            onError={handleImgError}
            className={styles["mob-detail-img"]}
          />
        </div>

        <h2>{mobResult.이름}</h2>
        {addField("LV", mobResult.레벨, ["center"])}
        <div className={styles["radius-container-box"]}>
          <div className={styles["flex-row"]}>
            {addField("HP", mobResult.HP ? mobResult.HP : "제보 바람", [
              "radius-small-box",
              "red",
            ])}
            {addField(
              "EXP",
              mobResult.경험치 ? mobResult.경험치 : "제보 바람",
              ["radius-small-box", "light-green"]
            )}
            {addField(
              "공격력",
              mobResult.공격력 ? mobResult.공격력 : "제보 바람",
              ["radius-small-box", "yellow"]
            )}
            {addField("회피율", mobResult.회피율, ["radius-small-box", "pink"])}
          </div>
        </div>
        <div className={styles["radius-container-box"]}>
          <label>추천 사냥터</label>
          <br></br>

          <label className={styles["text-color-pink"]}>
            {mobResult["추천 사냥터"]}
          </label>
          <br></br>

          {addMopType(mobResult)}
          <label>
            메소:{" "}
            {mobResult["메소"]
              ? mobResult["메소"].toLocaleString()
              : "제보 바람"}
          </label>
        </div>
      </div>

      <div className={styles["mob-detail-card-row2"]}>
        {drops.split("/").map((drop, index) => (
          <button
            className={styles["mob-detail-card-item-card-button"]}
            onClick={() => handleItemClick(drop.split("(")[0].trim())} // 클릭 이벤트 추가
          >
            <div className={styles.card} key={index}>
              <img
                className={styles["item-detail-img"]}
                src={itemImg(drop.split("(")[0].trim())}
              ></img>
              <label>{drop.split("(")[0]}</label>
              <label>
                {drop.split("(")[1]
                  ? `(${drop.split("(")[1].slice(0, -1)})`
                  : ""}
              </label>
            </div>
          </button>
        ))}

        {mobResult.주문서 &&
          mobResult.주문서.trim() !== "" &&
          mobResult.주문서.split("/").map((scroll, index) => (
            <div className={styles["card"]} key={index}>
              <img
                className={styles["item-detail-img"]}
                src={
                  scrollType[scroll] === "혼돈의 주문서"
                    ? "https://maplestory.io/api/GMS/210.1.1/item/2049100/icon?resize=8" // 혼돈의 주문서 이미지 URL
                    : scrollType[scroll] === "백의 주문서"
                    ? "https://maplestory.io/api/JMS/419/item/2340000/icon?resize=8" // 백의 주문서 이미지 URL
                    : "https://maplestory.io/api/GMS/210.1.1/item/2046314/icon?resize=8" // 기본 이미지
                }
                alt={scrollType[scroll]}
              />
              <label>{scrollType[scroll]}</label>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MobDetailCard;
