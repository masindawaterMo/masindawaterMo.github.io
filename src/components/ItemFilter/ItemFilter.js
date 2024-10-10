import React, { useState, useEffect } from "react";
import styles from "./ItemFilter.module.css";
import itemType from "../../data/itemType";
import jobs from "../../data/jobs";
import items from "../../data/item";

const ItemFilter = ({ setFilteredItems }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedItemTypes, setSelectedItemTypes] = useState([]);

  const toggleJobSelection = (job) => {
    setSelectedJobs((prevSelectedJobs) =>
      prevSelectedJobs.includes(job)
        ? prevSelectedJobs.filter((j) => j !== job)
        : [...prevSelectedJobs, job]
    );
  };

  const toggleItemTypeSelection = (type) => {
    setSelectedItemTypes((prevSelectedItemTypes) =>
      prevSelectedItemTypes.includes(type)
        ? prevSelectedItemTypes.filter((t) => t !== type)
        : [...prevSelectedItemTypes, type]
    );
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      const filteredItems = items.filter((item) => {
        const itemJobs = item.직업.split("/");
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
      setFilteredItems(filteredItems);
    }, 100); // 300ms 딜레이

    return () => clearTimeout(debounce);
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
            onTouchEnd={(e) => {
              e.preventDefault(); // 기본 동작 방지
              toggleJobSelection(job);
            }}
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
              onTouchEnd={(e) => {
                e.preventDefault();
                toggleItemTypeSelection(type);
              }}
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
              onTouchEnd={(e) => {
                e.preventDefault();
                toggleItemTypeSelection(type);
              }}
            >
              {type}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ItemFilter;
