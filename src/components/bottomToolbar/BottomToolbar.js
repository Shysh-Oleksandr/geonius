import React, { useEffect, useRef } from "react";
import { AiFillStar } from "react-icons/ai";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoMdCheckmark,
} from "react-icons/io";
import { useState } from "react/cjs/react.development";
import { MODES, useGlobalContext } from "./../../context";
import MyListBtn from "./../MyListBtn";
import "./bottomToolbar.css";
import { MdReplay } from "react-icons/md";

const BottomToolbar = ({ currentCategoryWords, isCorrect }) => {
  const {
    setCurrentWordIndex,
    currentWordIndex,
    currentCategory,
    setIsCategoryCompleted,
    isCategoryCompleted,
    getListData,
    starredList,
    setStarredList,
    myAddedLists,
    setMyAddedLists,
    setMyLists,
    unknownUncertainList,
    setUnknownUncertainList,
    currentMode,
    showAlert,
  } = useGlobalContext();

  const [starred, setStarred] = useState(false);
  const [isSlided, setIsSlided] = useState(true);

  const slideRef = useRef();

  const currentWord = currentCategoryWords[currentWordIndex];

  useEffect(() => {
    if (currentMode === MODES.SLIDE) setIsSlided(true);
    checkListsForWord();

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentWordIndex, currentCategoryWords, currentMode]);

  useEffect(() => {
    if (!isCategoryCompleted) {
      setCurrentWordIndex(0);
    }
  }, [currentCategory, isCategoryCompleted]);

  useEffect(() => {
    setMyLists((prevMyLists) => {
      let newMyLists = prevMyLists.map((prevMyList) => {
        if (prevMyList.listName === "Unknown + Uncertain") {
          return unknownUncertainList;
        } else {
          return prevMyList;
        }
      });
      return newMyLists;
    });
  }, [unknownUncertainList]);

  function handleKeyPress(e) {
    if (e.key === "ArrowLeft" || e.key === "Backspace") {
      decrement();
    } else if (e.key === "ArrowRight" || e.key === "Enter") {
      increment();
    } else if (e.key === " ") {
      if (currentMode === MODES.SLIDE) setIsSlided(false);
    }
  }

  function checkListsForWord() {
    // For my lists.
    setMyAddedLists((prevLists) => {
      let newLists = prevLists.map((myList) => {
        // Remove active from each one.
        myList.className = myList.className.replace(" active", "");
        // If the word is in a list, make the list active.
        if (myList.listWordsArray.includes(currentWord)) {
          myList.className += " active";
        }
        return myList;
      });
      return newLists;
    });

    // For the starred list.
    // If the word is in starred list then make starred active. Otherwise removes active.
    starredList.listWordsArray.includes(currentWord)
      ? setStarred(true)
      : setStarred(false);
  }

  function increment() {
    if (currentWordIndex === currentCategoryWords.length - 1) {
      setIsCategoryCompleted(true);
    } else {
      setIsCategoryCompleted(false);
      setCurrentWordIndex(currentWordIndex + 1);
    }
  }

  function decrement() {
    currentWordIndex !== 0 && setCurrentWordIndex(currentWordIndex - 1);
  }

  const handleStarredClick = (starredListArray) => {
    if (!starred) {
      starredListArray.listWordsArray.unshift(currentWord);
      showAlert(true, "Saved to Starred");
    } else {
      starredListArray.listWordsArray = starredListArray.listWordsArray.filter(
        (word) => word !== currentWord
      );
      showAlert(true, "Removed from Starred");
    }
    setStarred(!starred);
    setStarredList(starredListArray);
  };

  const handleAddToList = (listName) => {
    // Find the current list(that was clicked).
    let currentList = myAddedLists.find(
      (myList) => myList.listName === listName
    );

    // Remove the current word and active class from each list.
    function clearMyLists() {
      myAddedLists.map((myList) => {
        myList.className = myList.className.replace(" active", "");
        myList.listWordsArray = myList.listWordsArray.filter(
          (word) => word !== currentWord
        );
      });
    }
    // If the active list was clicked again, return unchanged state.
    if (currentList.className.includes("active")) {
      clearMyLists();
      showAlert(true, `Removed from "${listName.toLowerCase()}" words list.`);
    } else {
      clearMyLists();
      // Add the current word to the current list and make current list btn active.
      currentList.listWordsArray.unshift(currentWord);
      currentList.className += " active";

      showAlert(true, `Added to "${listName.toLowerCase()}" words list.`);
    }
    let unknownUncertainListArray = [
      ...getListData("Unknown").listWordsArray,
      ...getListData("Uncertain").listWordsArray,
    ];

    setUnknownUncertainList((prev) => {
      return { ...prev, listWordsArray: unknownUncertainListArray };
    });
  };

  if (currentMode === MODES.QUIZ) {
    return (
      <div className="bottom-toolbar quiz-mode">
        {isCorrect ? (
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
            >
              <span>
                <MdReplay />
              </span>{" "}
              Try again
            </button>
            <button
              type="button"
              className="bottom-toolbar__answer bottom-toolbar__arrow"
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
  }

  return (
    <div
      className={`bottom-toolbar ${
        currentMode === MODES.SLIDE && isSlided ? "slide-mode" : ""
      }`}
    >
      <div
        onClick={() => setIsSlided(false)}
        ref={slideRef}
        className={`word__slide ${
          currentMode !== MODES.SLIDE || !isSlided ? "hidden" : ""
        }`}
      >
        <span className="word__slide-arrow">
          <IoIosArrowDown />
        </span>
      </div>
      <MyListBtn
        className={`word__star ${starred ? "active" : ""}`}
        icon={<AiFillStar />}
        onClick={() => handleStarredClick(starredList)}
      />

      <button
        type="button"
        className="bottom-toolbar__arrow-back bottom-toolbar__arrow"
        onClick={decrement}
      >
        <IoIosArrowBack />
      </button>
      <div className="bottom-toolbar__my-list-btns">
        {myAddedLists.map((myList, index) => {
          return (
            <MyListBtn
              key={index}
              className={`bottom-toolbar__${myList.className}`}
              icon={myList.icon}
              onClick={() => handleAddToList(myList.listName)}
            />
          );
        })}
      </div>

      <button
        type="button"
        className="bottom-toolbar__arrow-forward bottom-toolbar__arrow"
        onClick={increment}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default BottomToolbar;
