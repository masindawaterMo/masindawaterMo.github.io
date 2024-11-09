import React from "react";
import scrollType from "../../../data/scrollType";
import styles from "./ScrollCard.module.css";
import { useNavigate } from "react-router-dom";

const ScrollCard = ({ scroll, index }) => {
  const navigate = useNavigate(); // navigate 함수 선언
  const handleScrollClick = (scroll) => {
    navigate(`/scroll/${scroll}`); // 아이템 ID를 URL로 전달
  };

  const scrollName = !scrollType[scroll] ? scroll : scrollType[scroll];

  return (
    <button
      className={styles["card"]}
      key={index}
      onClick={() => handleScrollClick(scroll)}
    >
      <img
        className={styles["item-detail-img"]}
        src={
          scrollName === "혼돈의 주문서"
            ? "https://maplestory.io/api/GMS/210.1.1/item/2049100/icon?resize=8" // 혼돈의 주문서 이미지 URL
            : scrollName === "백의 주문서"
            ? "https://maplestory.io/api/JMS/419/item/2340000/icon?resize=8" // 백의 주문서 이미지 URL
            : "https://maplestory.io/api/GMS/210.1.1/item/2046314/icon?resize=8" // 기본 이미지
        }
        alt={scrollName}
      />
      <label>{scrollName}</label>
    </button>
  );
};

export default ScrollCard;
