import React from "react";
import attackSpeeds from "../../../data/attackSpeeds";
import weaponTypes from "../../../data/weaponTypes";
import classes from "./ItemDetailCard.module.css";

const ItemDetailCard = (itemResult) => {
  if (!itemResult) return null;

  const addItemDetail = (label, value) => {
    return value ? (
      <p>
        {label} : {value}
      </p>
    ) : null;
  };

  const requirements = [
    { label: "REQ STR", value: itemResult.필요STR },
    { label: "REQ DEX", value: itemResult.필요DEX },
    { label: "REQ LUK", value: itemResult.필요LUK },
    { label: "REQ INT", value: itemResult.필요INT },
  ];

  const stats = [
    { label: "종류", value: weaponTypes[itemResult.종류] },
    { label: "STR", value: itemResult.STR },
    { label: "DEX", value: itemResult.DEX },
    { label: "INT", value: itemResult.INT },
    { label: "LUK", value: itemResult.LUK },
    { label: "공격 속도", value: attackSpeeds[itemResult.공격속도] },
    { label: "공격력", value: itemResult.공격력 },
    { label: "마력", value: itemResult.마력 },
    { label: "HP", value: itemResult.HP },
    { label: "MP", value: itemResult.MP },
    { label: "명중률", value: itemResult.명중률 },
    { label: "회피율", value: itemResult.회피율 },
    { label: "이동 속도", value: itemResult.이동속도 },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <label className={classes["text-wrapper-9"]}>{itemResult.이름}</label>

        <div className={classes.group}>
          <div className={classes.overlap}>
            <div className={classes["overlap-group"]}>
              <div className={classes["image-wrapper"]}>
                <img
                  className={classes.image}
                  alt="Item"
                  src={`https://maplestory.io/api/kms/284/item/${
                    itemResult.imgCode || 4001102
                  }/icon?resize=10`}
                />
              </div>

              <div className={classes["dashed-box"]} />
              <div className={classes["text-wrapper"]}>
                REQ LEV : {itemResult["필요 레벨"]}
              </div>

              {requirements.map((req) => (
                <div
                  key={req.label}
                  className={`${classes[req.label.replace(" ", "-")]} ${
                    req.value === 0 ? classes["REQ-0"] : ""
                  }`}
                >
                  {req.label === "REQ INT" ? req.label + " " : req.label} :{" "}
                  {req.value || "000"}
                </div>
              ))}

              <div className={classes["text-container-h"]}>
                <div
                  className={`${classes["dashed-box"]} ${classes["move-left-and-top"]}`}
                />
                <br></br>
                {stats.map((stat) => addItemDetail(stat.label, stat.value))}
                <br />
                {addItemDetail(
                  "판매 가격",
                  itemResult.판매비용.toLocaleString("ko-KR")
                )}
                {addItemDetail("드랍 몬스터", itemResult.itemDropMobs)}
              </div>

              <div className={classes["navbar-wrapper"]}>
                <div className={classes.navbar}>
                  {["초보자", "마법사", "도적", "전사", "궁수", "해적"].map(
                    (job, index) => (
                      <div
                        key={index}
                        className={`${classes[`text-wrapper-${index + 3}`]} ${
                          itemResult.직업.includes(job) ||
                          itemResult.직업.includes("공용")
                            ? classes["job"]
                            : ""
                        }`}
                      >
                        {job}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailCard;
