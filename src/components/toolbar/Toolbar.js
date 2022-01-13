import React from "react";
import { MdPlayArrow, MdChromeReaderMode, MdLanguage } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import "./toolbar.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useGlobalContext } from "./../../context";
import langs from "./../../resources/langData";

const Toolbar = ({ currentCategory, currentCategoryWords }) => {
  const {
    setIsCategoryMenuOpened,
    setIsLangChosen,
    currentWordIndex,
    lang,
    setIsWordListOpened,
    targetLang,
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
          <h4 className="toolbar__category-title">
            {currentCategory ? currentCategory : "Learned"}
          </h4>
          <div className="toolbar__category-words">
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
        <button
          type="button"
          className="toolbar__words-list"
          onClick={() => setIsWordListOpened(true)}
        >
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
