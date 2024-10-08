import React from "react";
import ItemCard from "../../components/Card/ItemCard/ItemCard";
import item from "../../data/item";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <h1>Maple History Mo</h1>
      <div className="container">
        <div class="raw">
          {item.map((a, i) => {
            return item[i].imgCode != 0 ? (
              <ItemCard item={item[i]} i={i}></ItemCard>
            ) : (
              ""
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
