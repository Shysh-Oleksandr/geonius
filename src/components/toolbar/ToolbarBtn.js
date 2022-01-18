import React from "react";

const ToolbarBtn = ({
  className,
  onClickFunction,
  icon,
  additionalInfo,
  conditionToShow,
}) => {
  if (conditionToShow === false) {
    return null;
  }
  return (
    <button type="button" className={className} onClick={onClickFunction}>
      {icon}
      {additionalInfo}
    </button>
  );
};

export default ToolbarBtn;
