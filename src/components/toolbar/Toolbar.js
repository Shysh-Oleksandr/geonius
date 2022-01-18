import React from "react";
import { MdPlayArrow, MdChromeReaderMode, MdLanguage } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import "./toolbar.css";
import { AiOutlineSearch } from "react-icons/ai";
import { MODES, useGlobalContext } from "./../../context";
import langs from "./../../resources/langData";
import ToolbarBtn from "./ToolbarBtn";

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
    currentWordSourceLang,
    currentWordTargetLang,
  } = useGlobalContext();

  function getLangsIcon(lang) {
    let foundLang = langs.find((langEl) => langEl.langCode === lang);
    return foundLang.flagIcon;
  }

  const toolbarBtns = [
    {
      class: "toolbar__category",
      onClickFunction: () => setIsCategoryMenuOpened(true),
      icon: (
        <div className="toolbar__category-icon">
          <MdPlayArrow />
        </div>
      ),
      additionalInfo: (
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
      ),
    },
    {
      class: "toolbar__language",
      onClickFunction: () => setIsLangChosen(false),
      icon: <MdLanguage />,
    },
    {
      class: "toolbar__words-list",
      onClickFunction: () => setIsWordListOpened(true),
      icon: <GiHamburgerMenu />,
      conditionToShow: currentMode !== MODES.QUIZ,
    },
    {
      class: "toolbar__mode",
      onClickFunction: () => setIsModeMenuOpened(true),
      icon: <MdChromeReaderMode />,
    },
  ];

  return (
    <div className="toolbar">
      <ToolbarBtn
        className={toolbarBtns[0].class}
        onClickFunction={toolbarBtns[0].onClickFunction}
        icon={toolbarBtns[0].icon}
        additionalInfo={toolbarBtns[0].additionalInfo}
      />
      <div className="toolbar__right">
        <div className="toolbar__curr-langs">
          <img
            src={getLangsIcon(currentWordSourceLang || lang)}
            alt="current language"
            className="toolbar__curr-lang-img"
          />
          <img
            src={getLangsIcon(currentWordTargetLang || targetLang)}
            alt="target language"
            className="toolbar__target-lang-img"
          />
        </div>
        {toolbarBtns.map((btn, index) => {
          if (index === 0) return;
          return (
            <ToolbarBtn
              key={index}
              className={btn.class}
              onClickFunction={btn.onClickFunction}
              icon={btn.icon}
              conditionToShow={btn.conditionToShow}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Toolbar;
