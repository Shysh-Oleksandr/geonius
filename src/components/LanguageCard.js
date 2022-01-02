import React from "react";

const LanguageCard = ({ lang, chooseLang }) => {
  return (
    <div className="language__card" onClick={() => chooseLang(lang)}>
      <div className="language__icon">
        <img src={lang.flagIcon} alt={lang.langName} />
      </div>
      <h3>{lang.langName}</h3>
    </div>
  );
};

export default LanguageCard;
