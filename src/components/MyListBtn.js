import React from "react";

const MyListBtn = ({ icon, className, onClick }) => {
  return (
    <button onClick={onClick} className={`my-list-btn ${className}`}>
      {icon}
    </button>
  );
};

export default MyListBtn;
