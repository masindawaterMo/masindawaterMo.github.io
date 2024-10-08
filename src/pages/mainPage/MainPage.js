import React, { useState } from 'react';
import './MainPage.css';

import item from '../../data/item';
import mobDropTable from '../../data/mobDropTable';
import mobInfo from '../../data/mobInfo';
import attackSpeeds from '../../data/attackSpeeds';
import weaponTypes from '../../data/weaponTypes';

function Main(){
    const [searchInput, setSearchInput] = useState('');
    const [searchInput2, setSearchInput2] = useState('');
    const [searchInput3, setSearchInput3] = useState('');
    const [result, setResult] = useState(null);
    const [result2, setResult2] = useState(null);
    const [result3, setResult3] = useState(null);

    const searchItem = () => {
        const foundItem = item.find(i => i.이름.includes(searchInput));
        if (!foundItem) {
            alert('해당 아이템을 찾을 수 없습니다.');
            return;
        }

        const foundMobs = new Set();
        mobDropTable.forEach(mob => {
            if (Object.values(mob).some(drop => drop === foundItem.이름)) {
                foundMobs.add(mob);
            }
        });

        let itemDropMobs = " 해당 아이템을 드랍하는 몬스터가 없습니다.";
        if (foundMobs.size > 0) {
            itemDropMobs = Array.from(foundMobs).map(mob => `[${mob.이름}]`).join(', ');
        }

        setResult({
            ...foundItem,
            itemDropMobs
        });
    };

    const searchMob = () => {
        const foundMob = mobDropTable.find(mob => mob.이름.includes(searchInput2));
        if (!foundMob) {
            alert('해당 몬스터를 찾을 수 없습니다.');
            return;
        }

        const mobDetail = mobInfo.find(i => i.이름 === foundMob.이름);
        setResult2({ ...foundMob, mobDetail });
    };

    const searchScroll = () => {
        const foundScroll = mobDropTable.find(i => i.이름.includes(searchInput3));
        if (!foundScroll) {
            alert('해당 주문서를 찾을 수 없습니다.');
            return;
        }
        setResult3(foundScroll);
    };

    const renderItem = () => {
        if (!result) return null;

        return (
            <div class="content">
                <img src={`https://maplestory.io/api/kms/284/item/${result.imgCode}/icon?resize=2`} alt="Item" />
                <h2>{result.이름}</h2>
                <p>LV: {result["필요 레벨"]}</p>
                <p>종류: {weaponTypes[result.종류]}</p>
                <p>직업: {result.직업}</p>
                <p>REQ STR: {result.필요STR}</p>
                <p>REQ DEX: {result.필요DEX}</p>
                <p>REQ INT: {result.필요INT}</p>
                <p>REQ LUK: {result.필요LUK}</p>
                <p>공격 속도: {attackSpeeds[result.공격속도]}</p>
                <p>공격력: {result.공격력}</p>
                <p>마력: {result.마력}</p>
                <p>HP: {result.HP}</p>
                <p>MP: {result.MP}</p>
                <p>명중률: {result.명중률}</p>
                <p>회피율: {result.회피율}</p>
                <p>이동속도: {result.이동속도}</p>
                <p>판매비용: {result.판매비용}</p>
                <p>드랍 몬스터: {result.itemDropMobs}</p>
            </div>
        );
    };

    const renderMob = () => {
        if (!result2) return null;

        return (
            <div>
                <h2>{result2.이름}</h2>
                {/* 몬스터의 상세 정보를 여기에 추가 */}
            </div>
        );
    };

    return (
        <div id='wrap'>
                <h1>아이템</h1>
                <div style={{ textAlign: 'center' }}>
                    <input type="text" placeholder="ex) 글라디우스" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <button onClick={searchItem}>검색</button>
                </div>
                <div class="wrapper">
                    <div class="content">
                        {renderItem()}
                    </div>
                </div>

                <h1>몬스터</h1>
                <div style={{ textAlign: 'center' }}>
                    <input type="text" placeholder="ex) 달팽이" value={searchInput2} onChange={(e) => setSearchInput2(e.target.value)} />
                    <button onClick={searchMob}>검색</button>
                </div>
                <div>{renderMob()}</div>

                <h1>주문서</h1>
                <div style={{ textAlign: 'center' }}>
                    <input type="text" placeholder="ex1) 한손검 ex2) 장공" value={searchInput3} onChange={(e) => setSearchInput3(e.target.value)} />
                    <button onClick={searchScroll}>검색</button>
                </div>
                <div>{result3 && <p>{result3.이름}</p>}</div>


        </div>
    );
}

export default Main;