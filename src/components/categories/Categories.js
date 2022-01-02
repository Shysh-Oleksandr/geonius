import React from "react";
import Category from "../Category";
import "./categories.css";
import {
  BiCategory,
  BsQuestionLg,
  AiFillFolder,
  AiFillStar,
  CgShapeTriangle,
  IoMdCheckmark,
} from "./imports";

const Categories = ({ levels }) => {
  const myLists = [
    {
      name: "Unknown + Uncertain",
      className: "unknown-uncertain-icon",
      icon: <BsQuestionLg />,
      secondIcon: <CgShapeTriangle />,
    },
    {
      name: "Unknown",
      className: "unknown-icon",
      icon: <BsQuestionLg />,
    },
    {
      name: "Uncertain",
      className: "uncertain-icon",
      icon: <CgShapeTriangle />,
    },
    {
      name: "Learned",
      className: "learned-icon",
      icon: <IoMdCheckmark />,
    },
    {
      name: "Favorites",
      className: "favorites-icon",
      icon: <AiFillStar />,
    },
  ];
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
          {myLists.map((list, index) => {
            return (
              <Category
                key={index}
                name={list.name}
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
