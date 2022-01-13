import { React, useRef, useEffect } from "react";
import Category from "../Category";
import { AiFillFolder, BiCategory } from "./imports";
import { useGlobalContext } from "./../../context";
import "./categories.css";

const Categories = () => {
  const {
    levels,
    isCategoryMenuOpened,
    setIsCategoryMenuOpened,
    currentCategory,
    setCurrentCategory,
    setCurrentWordIndex,
    getCategoryWords,
    myLists,
  } = useGlobalContext();

  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (
        isCategoryMenuOpened &&
        currentCategory &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setIsCategoryMenuOpened(false);
      }
    };

    document.addEventListener("mouseup", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mouseup", checkIfClickedOutside);
    };
  }, [isCategoryMenuOpened]);

  function openCategory(categoryName) {
    let categoryWords = getCategoryWords(categoryName);
    if (categoryWords.length === 0) {
      // Show Modal
      console.log("modal aobut zero words in catefg");
    } else {
      setIsCategoryMenuOpened(false);
      setCurrentCategory(categoryName);
      setCurrentWordIndex(0);
    }
  }

  return (
    <div className={`categories__wrapper`}>
      <div className="categories" ref={ref}>
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
                name={list.listName}
                className={list.className}
                icon={list.icon}
                secondIcon={list.secondIcon}
                openCategory={openCategory}
                levelWords={list.listWordsArray}
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
                openCategory={openCategory}
              />
            );
          })}
        </div>
        <button
          className="categories__cancel-btn"
          onClick={() => currentCategory && setIsCategoryMenuOpened(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Categories;
