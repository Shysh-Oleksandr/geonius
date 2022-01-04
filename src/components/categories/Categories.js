import React from "react";
import Category from "../Category";
import { AiFillFolder, BiCategory } from "./imports";
import { useGlobalContext } from "./../../context";
import myListsData from "./../../resources/myListsData";
import "./categories.css";

const Categories = () => {
  const { levels } = useGlobalContext();

  return (
    <div className="categories__wrapper">
      <div className="categories">
        <div className="categories__my-lists">
          <h3>
            <span>
              <AiFillFolder />
            </span>
            My lists
          </h3>
          {myListsData.map((list, index) => {
            return (
              <Category
                key={index}
                name={list.listName}
                className={list.className}
                icon={list.icon}
                secondIcon={list.secondIcon}
              />
            );
          })}
        </div>
        <div className="categories__levels">
          <h3>
            <span>
              <BiCategory />
            </span>{" "}
            Levels
          </h3>
          {levels.map((level) => {
            return (
              <Category
                name={level.levelName}
                key={level.levelIndex}
                levelWords={level.levelWordsArray}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
