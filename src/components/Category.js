import React from "react";

const Category = ({
  name,
  levelWords,
  icon,
  secondIcon,
  className,
  openCategory,
}) => {
  return (
    <div className="category" onClick={() => openCategory(levelWords, name)}>
      <h4>
        <span className={className}>{icon}</span>
        {secondIcon && <span className={className}>{secondIcon}</span>}
        {name}{" "}
        {levelWords && (
          <span className="category__words">({levelWords.length})</span>
        )}
      </h4>
    </div>
  );
};

export default Category;
