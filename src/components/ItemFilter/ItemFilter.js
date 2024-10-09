import React, { useState, useEffect } from "react";
import styles from "./ItemFilter.module.css";
import itemType from "../../data/itemType";
import jobs from "../../data/jobs";
import items from "../../data/item";

const ItemFilter = ({ setFilteredItems }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedItemTypes, setSelectedItemTypes] = useState([]);

  const toggleJobSelection = (job) => {
    if (selectedJobs.includes(job)) {
      setSelectedJobs(selectedJobs.filter((j) => j !== job));
    } else {
      setSelectedJobs([...selectedJobs, job]);
    }
  };

  const toggleItemTypeSelection = (type) => {
    if (selectedItemTypes.includes(type)) {
      setSelectedItemTypes(selectedItemTypes.filter((t) => t !== type));
    } else {
      setSelectedItemTypes([...selectedItemTypes, type]);
    }
  };

  useEffect(() => {
    const filteredItems = items.filter((item) => {
      const itemJobs = item.직업.split("/"); // 직업을 /로 분리
      const isJobMatch =
        selectedJobs.length === 0 ||
        selectedJobs.some(
          (job) => itemJobs.includes(job) || itemJobs.includes("공용")
        );
      const isTypeMatch =
        selectedItemTypes.length === 0 ||
        selectedItemTypes.includes(itemType[item.종류]);
      return isJobMatch && isTypeMatch;
    });

    // 필터된 아이템 목록을 부모로 전달
    setFilteredItems(filteredItems);
  }, [selectedJobs, selectedItemTypes, setFilteredItems]);

  return (
    <div className={styles["filter-container"]}>
      <label>아이템 필터</label>

      <div className={styles["button-container"]}>
        {Object.entries(jobs).map(([key, job]) => (
          <button
            key={key}
            className={`${styles["filter-button"]} ${
              selectedJobs.includes(job) ? styles.active : ""
            }`}
            onClick={() => toggleJobSelection(job)}
          >
            {job}
          </button>
        ))}
      </div>

      {/* 첫 번째 줄 버튼들 (key가 17 미만) -> 방패까지 */}
      <div className={styles["button-container"]}>
        {Object.entries(itemType)
          .filter(([key]) => key < 17)
          .map(([key, type]) => (
            <button
              key={key}
              className={`${styles["filter-button"]} ${
                selectedItemTypes.includes(type) ? styles.active : ""
              }`}
              onClick={() => toggleItemTypeSelection(type)}
            >
              {type}
            </button>
          ))}
      </div>

      {/* 두 번째 줄 버튼들 (key가 17 이상) -> 모자 부터 */}
      <div className={styles["button-container"]}>
        {Object.entries(itemType)
          .filter(([key]) => key >= 17)
          .map(([key, type]) => (
            <button
              key={key}
              className={`${styles["filter-button"]} ${
                selectedItemTypes.includes(type) ? styles.active : ""
              }`}
              onClick={() => toggleItemTypeSelection(type)}
            >
              {type}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ItemFilter;
