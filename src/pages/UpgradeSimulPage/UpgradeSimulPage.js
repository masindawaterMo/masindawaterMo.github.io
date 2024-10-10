import React, { useEffect, useState } from "react";
import UpgradeItemCard from "../../components/Card/UpgradeItemCard/UpgradeItemCard";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  orderBy,
  limit,
  getDocs,
  query,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import styles from "./UpgradeSimulPage.module.css";

const UpgradeSimulPage = () => {
  const [rankingList, setRankingList] = useState([]); // 랭킹 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // Firebase 구성 객체 (필요에 맞게 수정)
  const firebaseConfig = {
    apiKey: "AIzaSyBGk1yJte7WYB7P0GX9dPOvobi9M-CDc0Q",
    authDomain: "maple-history.firebaseapp.com",
    projectId: "maple-history",
    storageBucket: "maple-history.appspot.com",
    messagingSenderId: "374077725888",
    appId: "1:374077725888:web:371a2c0764e8855daea125",
    measurementId: "G-NGJHNHST7L",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const analytics = getAnalytics(app);

  // 랭킹을 가져오는 함수
  const getRanking = async () => {
    const rankingsRef = collection(db, "rankings");
    const rankingQuery = query(
      rankingsRef,
      orderBy("upgradeCount", "desc"),
      limit(5)
    );

    const querySnapshot = await getDocs(rankingQuery);
    const rankingList = [];
    querySnapshot.forEach((doc) =>
      rankingList.push({ id: doc.id, ...doc.data() })
    );

    return rankingList;
  };

  // 페이지가 처음 로드될 때 랭킹을 가져옴
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true); // 데이터 로딩 시작
        const rankingData = await getRanking();
        setRankingList(rankingData); // 랭킹 데이터 업데이트
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false); // 데이터 로딩 완료
      }
    };

    fetchRanking();
  }, []);

  return (
    <div id="wrap">
      <h1>강화 시뮬레이터</h1>
      <div className={styles["card-center"]}>
        <div className={styles["left"]}>
          <h1 className={styles["left-title"]}>단축키</h1>
          <h2>Q : 강화</h2>
          <h2>R : 리셋</h2>
        </div>
        <UpgradeItemCard rankingList={rankingList} />
        <div className={styles["right"]}>
          <h1>Top 5</h1>
          {loading ? (
            <p>Loading...</p> // 데이터 로딩 중일 때 표시
          ) : (
            <ul className={styles["rank-ul"]}>
              {rankingList.map((rank, index) => (
                <li key={rank.id} className={styles["rank-li"]}>
                  {index + 1}. {rank.nickname} - {rank.upgradeCount}강
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeSimulPage;
