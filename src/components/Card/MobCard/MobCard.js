import "./MobCard.css";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";

const MobCard = (props) => {
  const [errorCount, setErrorCount] = useState(0);
  const errorCountRef = useRef(errorCount); // 최신 상태를 추적하기 위한 useRef

  const navigate = useNavigate(); // navigate 함수 선언
  const handleMobClick = (mobName) => {
    navigate(`/mob/${mobName}`); // 아이템 ID를 URL로 전달
  };

  const handleImgError = (e) => {
    errorCountRef.current += 1; // useRef로 최신 상태 업데이트
    setErrorCount(errorCountRef.current);

    if (errorCountRef.current === 1) {
      e.target.src = `https://maplestory.io/api/kms/284/mob/${props.mob.mobCode}/icon?resize=2`;
    } else if (errorCountRef.current === 2) {
      e.target.src = `https://maplestory.io/api/TMS/209/mob/animated/${props.mob.mobCode}/move`;
    } else if (errorCountRef.current === 3) {
      e.target.src = `https://maplestory.io/api/TMS/209/mob/${props.mob.mobCode}/icon?resize=2`;
    } else {
      e.target.onerror = null;
      e.target.src = `https://maplestory.io/api/kms/284/mob/1210102/icon?resize=2`;
    }
  };

  return (
    <button
      className="mob-card-container mob-card-button"
      onClick={() => handleMobClick(props.mob.이름)} // 클릭 이벤트 추가
    >
      <div className="mob-column-center">
        <div className="mob-image-container">
          <img
            className="mob-image"
            src={
              props.mob.mobCode !== 0
                ? `https://maplestory.io/api/kms/284/mob/animated/${props.mob.mobCode}/move`
                : "https://maplestory.io/api/kms/284/mob/1210102/icon?resize=1"
            }
            onError={handleImgError}
            alt="mob"
          />
        </div>

        <label className="mob-text">{props.mob.이름}</label>
      </div>

      <div className="mob-text">
        <label className="mob-text-label" style={{ color: "#F2F2F2" }}>
          LV &nbsp;{props.mob["레벨"]}
        </label>
        <label className="mob-text-label" style={{ color: "#FF7C80" }}>
          HP &nbsp;{props.mob["HP"]}
        </label>
        <label className="mob-text-label" style={{ color: "#85BD5F" }}>
          EXP {props.mob["경험치"]}
        </label>
      </div>
    </button>
  );
};

export default MobCard;
