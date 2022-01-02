import React from "react";
import LanguageCard from "./LanguageCard";

const LanguageSelection = ({ lang, langs, selectCurrentLanguage }) => {
  return (
    <div>
      <div className="language-selection-header">
        <h2>Language Courses for {lang} Speakers</h2>
        <div className="i-speak">
          <span>I speak </span>
          <select
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
      <div className="language-selection-bottom">
        {langs.map((lang, index) => {
          return <LanguageCard lang={lang} key={index} />;
        })}
      </div>
    </div>
  );
};

export default LanguageSelection;
