import React from "react";
import "./ItemCard.css";
import { useNavigate } from "react-router-dom";

const ItemCard = (props) => {
  const navigate = useNavigate(); // navigate 함수 선언
  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`); // 아이템 ID를 URL로 전달
  };

  return (
    <button
      className="card-container item-card-button"
      onClick={() => handleItemClick(props.item.코드)} // 클릭 이벤트 추가
    >
      <img
        className="item-image"
        src={
          props.item.imgCode != 0
            ? `https://maplestory.io/api/kms/284/item/${props.item.imgCode}/icon?resize=10`
            : `https://maplestory.io/api/kms/284/item/4001102/icon?resize=10`
        }
        alt="Item"
      />

      <div className="item-text">
        <label>{props.item.이름}</label>
        <label>레벨 {props.item["필요 레벨"]}</label>
      </div>
    </button>
  );
};

export default ItemCard;
