import React from "react";
import LanguageCard from "./LanguageCard";
import langs from "./../resources/langData";
import { useGlobalContext } from "./../context";

const LanguageSelection = () => {
  const { currLangName, selectCurrentLanguage, chooseLang } =
    useGlobalContext();

  return (
    <div className="language-selection">
      <div className="language-selection__header">
        <h2>Language Courses for {currLangName} Speakers</h2>
        <div className="i-speak">
          <span>I speak </span>
          <select
            className="language__select"
            onChange={selectCurrentLanguage}
            name="currentLanguage"
            id="currentLanguage"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="ru">Russian</option>
          </select>
        </div>
      </div>
      <div className="language-selection__bottom">
        {langs.map((langEl, index) => {
          if (langEl.langName !== currLangName) {
            return (
              <LanguageCard lang={langEl} key={index} chooseLang={chooseLang} />
            );
          }
        })}
      </div>
    </div>
  );
};

export default LanguageSelection;
