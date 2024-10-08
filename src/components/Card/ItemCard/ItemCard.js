import React from "react";
import "./ItemCard.css";

const ItemCard = (props) => {
  return (
    <div>
      <div className="card-container">
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
      </div>
    </div>
  );
};

export default ItemCard;
