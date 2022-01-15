import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdReplay } from "react-icons/md";
import { useGlobalContext } from "./../../context";
import "./categoryCompletedModal.css";

const CategoryCompletedModal = () => {
  const {
    setIsCategoryMenuOpened,
    setCurrentCategoryWords,
    setIsCategoryCompleted,
    setCurrentCategory,
    setCurrentWordIndex,
  } = useGlobalContext();

  function handleNewCategory() {
    setIsCategoryMenuOpened(true);
    setCurrentCategoryWords([]);
    setCurrentCategory(null);
    setIsCategoryCompleted(false);
    setCurrentWordIndex(0);
  }
  function handleCurrentCategory() {
    setIsCategoryCompleted(false);
    setCurrentWordIndex(0);
  }
  return (
    <div className={`category-completed__wrapper`}>
      <div className="category-completed">
        <h3 className="category-completed-congratulations">Congratulations!</h3>
        <p className="category-completed-text">
          The last item. Would you like to select new category, or repeat the
          current one?
        </p>
        <div className="category-completed-btns">
          <button
            className="category-completed-btn"
            onClick={handleNewCategory}
          >
            <span>
              <IoMdCheckmark />
            </span>
            New category
          </button>
          <button
            className="category-completed-btn"
            onClick={handleCurrentCategory}
          >
            <span>
              <MdReplay />
            </span>
            Current category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCompletedModal;
