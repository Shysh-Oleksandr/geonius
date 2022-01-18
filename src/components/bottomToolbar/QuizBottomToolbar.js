import React from "react";
import { AiFillStar } from "react-icons/ai";
import { useGlobalContext } from "../../context";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdCheckmark,
} from "react-icons/io";
import { MdReplay } from "react-icons/md";
import MyListBtn from "./../MyListBtn";
import { MY_LISTS_ICONS } from "../../resources/myListsData";
import "../word/quiz.css";

const QuizBottomToolbar = ({
  starred,
  handleStarredClick,
  isCorrect,
  setGuess,
  handleAddToList,
  setShowWordInfo,
  decrement,
  showWordInfo,
  increment,
}) => {
  const { myAddedLists } = useGlobalContext();
  return (
    <div className="bottom-toolbar quiz-mode">
      <MyListBtn
        className={`word__star ${starred ? "active" : ""}`}
        icon={<AiFillStar />}
        onClick={(e) => handleStarredClick(e)}
      />
      <div
        className="bottom-toolbar__my-list-btns"
        onClick={(e) => {
          if (!e) e = window.event;
          e.stopPropagation();
        }}
      >
        {myAddedLists.map((myList, index) => {
          return (
            <MyListBtn
              key={index}
              className={`bottom-toolbar__${myList.className}`}
              icon={MY_LISTS_ICONS[index + 1].icon}
              onClick={() => handleAddToList(myList.listName)}
            />
          );
        })}
      </div>
      {isCorrect || showWordInfo ? (
        <div className="quiz__btns">
          <button
            type="button"
            className="bottom-toolbar__arrow-back bottom-toolbar__arrow"
            onClick={decrement}
          >
            <IoIosArrowBack />
          </button>
          <button
            type="button"
            className="bottom-toolbar__arrow-forward bottom-toolbar__arrow"
            onClick={increment}
          >
            Next{" "}
            <span>
              <IoIosArrowForward />
            </span>
          </button>
        </div>
      ) : (
        <div className="quiz__btns">
          <button
            type="button"
            className="bottom-toolbar__try-again  bottom-toolbar__arrow"
            onClick={(e) => {
              if (!e) e = window.event;
              e.stopPropagation();
              setShowWordInfo(false);
              setGuess({
                isGuessed: false,
                isCorrect: undefined,
                replay: true,
              });
            }}
          >
            <span>
              <MdReplay />
            </span>{" "}
            Try again
          </button>
          <button
            type="button"
            className="bottom-toolbar__answer bottom-toolbar__arrow"
            onClick={() => setShowWordInfo(true)}
          >
            <span>
              <IoMdCheckmark />
            </span>{" "}
            Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizBottomToolbar;
