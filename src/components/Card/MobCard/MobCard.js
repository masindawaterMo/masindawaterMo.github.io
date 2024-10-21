import React from "react";
import "./MobCard.css";
import { useNavigate } from "react-router-dom";

const MobCard = (props) => {
  const navigate = useNavigate(); // navigate 함수 선언
  const handleMobClick = (mobId) => {
    navigate(`/mob/${mobId}`); // 아이템 ID를 URL로 전달
  };

  return (
    <button
      className="card-container mob-card-button"
      onClick={() => handleMobClick(props.mob.코드)} // 클릭 이벤트 추가
    >
      <img
        className="mob-image"
        src={
          props.mob.imgCode != 0
            ? `https://maplestory.io/api/kms/284/mob/${props.mob.imgCode}/icon?resize=10`
            : `https://maplestory.io/api/kms/284/mob/4001102/icon?resize=10`
        }
        alt="mob"
      />

      <div className="mob-text">
        <label>{props.mob.이름}</label>
        <label>레벨 {props.mob["필요 레벨"]}</label>
      </div>
    </button>
  );
};

export default MobCard;
