import React, { useEffect, useState } from "react";
import UpgradeItemCard from "../../components/Card/UpgradeItemCard/UpgradeItemCard";
import { initializeApp } from "firebase/app";
import { Timestamp } from "firebase/firestore";
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
  where,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import styles from "./UpgradeSimulPage.module.css";

const UpgradeSimulPage = () => {
  const [rankingList, setRankingList] = useState([]); // 랭킹 데이터를 저장할 상태
  const [todayRankingList, setTodayRankingList] = useState([]); // 랭킹 데이터를 저장할 상태
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

  // 누적 랭킹을 가져오는 함수
  const getRanking = async () => {
    const rankingsRef = collection(db, "rankings");
    const rankingQuery = query(
      rankingsRef,
      orderBy("upgradeCount", "desc"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(rankingQuery);
    const rankingList = [];
    querySnapshot.forEach((doc) =>
      rankingList.push({ id: doc.id, ...doc.data() })
    );

    return rankingList;
  };

  // 오늘 날짜의 시작과 끝을 구하는 함수
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0); // 오늘의 시작 시간 (00:00:00)
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999); // 오늘의 끝 시간 (23:59:59)

  // 일일 랭킹을 가져오는 함수
  const getTodayRanking = async () => {
    const rankingsRef = collection(db, "rankings");
    const rankingQuery = query(
      rankingsRef,
      where("timestamp", ">=", Timestamp.fromDate(startOfToday)),
      where("timestamp", "<=", Timestamp.fromDate(endOfToday)),
      orderBy("upgradeCount", "desc"),
      orderBy("timestamp", "desc"),
      limit(10)
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
        const todayRankingData = await getTodayRanking();
        setRankingList(rankingData); // 랭킹 데이터 업데이트
        setTodayRankingList(todayRankingData);
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
      <div className="center">
        <div className={styles["upgrade-container"]}>
          <div className={styles["left"]}>
            <h1 className={styles["left-title"]}>단축키</h1>
            <h2>Q : 강화</h2>
            <h2>R : 리셋</h2>
          </div>
          <UpgradeItemCard rankingList={todayRankingList} />
          <div className={styles["right"]}>
            <h1>일일 Top 10</h1>
            {loading ? (
              <p>Loading...</p> // 데이터 로딩 중일 때 표시
            ) : (
              <ul className={styles["rank-ul"]}>
                {todayRankingList.map((rank, index) => (
                  <li
                    key={rank.id}
                    className={styles["rank-li"]}
                    style={{
                      color:
                        index === 0
                          ? "gold"
                          : index === 1
                          ? "#CF61F3"
                          : index === 2
                          ? "#cd7f32"
                          : "white",
                    }}
                  >
                    {index + 1}. {rank.nickname} - {rank.upgradeCount}강
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles["right"]}>
            <h1>누적 Top 10</h1>
            {loading ? (
              <p>Loading...</p> // 데이터 로딩 중일 때 표시
            ) : (
              <ul className={styles["rank-ul"]}>
                {rankingList.map((rank, index) => (
                  <li
                    key={rank.id}
                    className={styles["rank-li"]}
                    style={{
                      color:
                        index === 0
                          ? "gold"
                          : index === 1
                          ? "#CF61F3"
                          : index === 2
                          ? "#cd7f32"
                          : "white",
                    }}
                  >
                    {index + 1}. {rank.nickname} - {rank.upgradeCount}강
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeSimulPage;
