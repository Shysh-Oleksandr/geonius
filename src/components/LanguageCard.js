import React from "react";

const LanguageCard = ({ lang }) => {
  return (
    <div>
      <img src={lang.flagIcon} alt={lang.langName} />
      <h3>{lang.langName}</h3>
    </div>
  );
};

export default LanguageCard;
