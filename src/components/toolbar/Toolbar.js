import React from "react";
import { MdPlayArrow, MdChromeReaderMode, MdLanguage } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import "./toolbar.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useGlobalContext } from "./../../context";

const Toolbar = ({ currentCategory, currentCategoryWords }) => {
  const { isCategoryMenuOpened, setIsCategoryMenuOpened, setIsLangChosen } =
    useGlobalContext();
  return (
    <div className="toolbar">
      <button
        type="button"
        className="toolbar__category"
        onClick={() => setIsCategoryMenuOpened(!isCategoryMenuOpened)}
      >
        <div className="toolbar__category-icon">
          <MdPlayArrow />
        </div>
        <div className="toolbar__category-info">
          <h4 className="toolbar__category-title">
            {currentCategory ? currentCategory : "Learned"}
          </h4>
          <div className="toolbar__category-words">
            (1/{currentCategoryWords.length})
          </div>
        </div>
      </button>
      <div className="toolbar__right">
        <button
          type="button"
          className="toolbar__language"
          onClick={() => setIsLangChosen(false)}
        >
          <MdLanguage />
        </button>
        <button type="button" className="toolbar__search">
          <AiOutlineSearch />
        </button>
        <button type="button" className="toolbar__words-list">
          <GiHamburgerMenu />
        </button>
        <button type="button" className="toolbar__mode">
          <MdChromeReaderMode />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
