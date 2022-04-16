import React from "react";
import LanguageCard from "./LanguageCard";
import langs from "../../resources/langData";
import { useGlobalContext } from "../../context";
import "./languageSelection.css";

const LanguageSelection = () => {
  const { currLangName, selectCurrentLanguage, chooseLang, lang } =
    useGlobalContext();

  return (
    <div className="language-selection">
      <div className="language-selection__header">
        <h2>Language Courses for {currLangName} Speakers</h2>
        <div className="language-selection__source-lang">
          <div className="i-speak__label">I speak </div>

          <div className="i-speak">
            <select
              className="language__select"
              onChange={selectCurrentLanguage}
              name="currentLanguage"
              id="currentLanguage"
              value={lang}
            >
              {langs.map((lang, index) => {
                if (lang.langCode === "en") return;
                return (
                  <option key={index} value={lang.langCode}>
                    {lang.langName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="language-selection__bottom">
        {langs.map((langEl, index) => {
          if (langEl.langName !== currLangName && langEl.langCode === "en") {
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
