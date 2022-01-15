import React from "react";
import { MdPlayArrow, MdChromeReaderMode, MdLanguage } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import "./toolbar.css";
import { AiOutlineSearch } from "react-icons/ai";
import { MODES, useGlobalContext } from "./../../context";
import langs from "./../../resources/langData";

const Toolbar = ({ currentCategory, currentCategoryWords }) => {
  const {
    setIsCategoryMenuOpened,
    setIsLangChosen,
    currentWordIndex,
    setIsModeMenuOpened,
    lang,
    setIsWordListOpened,
    targetLang,
    currentMode,
  } = useGlobalContext();

  function getLangsIcon(lang) {
    let foundLang = langs.find((langEl) => langEl.langCode === lang);
    return foundLang.flagIcon;
  }

  return (
    <div className="toolbar">
      <button
        type="button"
        className="toolbar__category"
        onClick={() => setIsCategoryMenuOpened(true)}
      >
        <div className="toolbar__category-icon">
          <MdPlayArrow />
        </div>
        <div className="toolbar__category-info">
          <h4
            className={`toolbar__category-title ${
              currentCategoryWords.length === 0 ? "hidden" : ""
            }`}
          >
            {currentCategory ? currentCategory : "Category"}
          </h4>
          <div
            className={`toolbar__category-words ${
              currentCategoryWords.length === 0 ? "hidden" : ""
            }`}
          >
            ({currentWordIndex + 1}/{currentCategoryWords.length})
          </div>
        </div>
      </button>
      <div className="toolbar__right">
        <div className="toolbar__curr-langs">
          <img
            src={getLangsIcon(lang)}
            alt="current language"
            className="toolbar__curr-lang-img"
          />
          <img
            src={getLangsIcon(targetLang)}
            alt="target language"
            className="toolbar__target-lang-img"
          />
        </div>
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
        {currentMode !== MODES.QUIZ && (
          <button
            type="button"
            className="toolbar__words-list"
            onClick={() => setIsWordListOpened(true)}
          >
            <GiHamburgerMenu />
          </button>
        )}

        <button
          type="button"
          className="toolbar__mode"
          onClick={() => setIsModeMenuOpened(true)}
        >
          <MdChromeReaderMode />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
