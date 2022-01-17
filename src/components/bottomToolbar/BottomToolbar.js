import React, { useEffect, useRef } from "react";
import { AiFillStar } from "react-icons/ai";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoMdCheckmark,
} from "react-icons/io";
import { MdReplay } from "react-icons/md";
import { useState } from "react/cjs/react.development";
import { MY_LISTS_ICONS, MY_LISTS_NAMES } from "../../resources/myListsData";
import { MODES, useGlobalContext } from "./../../context";
import MyListBtn from "./../MyListBtn";
import "./bottomToolbar.css";
import "../word/quiz.css";

const BottomToolbar = ({
  currentCategoryWords,
  isCorrect,
  setGuess,
  setShowWordInfo,
  showWordInfo,
  guess,
}) => {
  const {
    setCurrentWordIndex,
    currentWordIndex,
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
    lang,
    targetLang,
  } = useGlobalContext();

  const [starred, setStarred] = useState(false);
  const [isSlided, setIsSlided] = useState(true);

  const slideRef = useRef();

  const currentWord = currentCategoryWords[currentWordIndex];

  useEffect(() => {
    if (currentMode === MODES.SLIDE) {
      setIsSlided(true);
    }
    checkListsForWord();

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    currentWordIndex,
    currentCategoryWords,
    currentMode,
    showWordInfo,
    guess,
  ]);

  useEffect(() => {
    if (currentMode === MODES.SLIDE) {
      if (isSlided) {
        document.body.classList.add("locked");
      } else {
        document.body.classList.remove("locked");
      }
    } else {
      document.body.classList.remove("locked");
    }
  }, [isSlided, currentMode]);

  useEffect(() => {
    if (isCategoryCompleted) {
      setCurrentWordIndex(0);
    }
  }, [currentCategoryWords]);

  useEffect(() => {
    setMyLists((prevMyLists) => {
      let newMyLists = prevMyLists.map((prevMyList) => {
        if (prevMyList.listName === MY_LISTS_NAMES.UNKNOWN_UNCERTAIN) {
          return unknownUncertainList;
        } else if (prevMyList.listName === MY_LISTS_NAMES.STARRED) {
          return starredList;
        } else {
          return prevMyList;
        }
      });
      return newMyLists;
    });
  }, [unknownUncertainList, starredList, myAddedLists, starred]);

  function handleKeyPress(e) {
    if (currentMode === MODES.QUIZ && !guess.isCorrect && !showWordInfo) return;
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
        if (
          myList.listWordsArray.filter((wordInfo) => {
            if (currentWord) {
              return wordInfo.word === currentWord.word;
            }
          }).length !== 0
        ) {
          myList.className += " active";
        }
        return myList;
      });
      return newLists;
    });

    // For the starred list.
    // If the word is in starred list then make starred active. Otherwise removes active.

    starredList.listWordsArray.filter((starredObject) => {
      if (currentWord) {
        return (
          starredObject.word === currentWord ||
          starredObject.word === currentWord.word
        );
      }
    }).length !== 0
      ? setStarred(true)
      : setStarred(false);
  }

  function increment(e) {
    if (!e) e = window.event;
    e.stopPropagation();

    if (currentWordIndex === currentCategoryWords.length - 1) {
      setIsCategoryCompleted(true);
    } else {
      setIsCategoryCompleted(false);
      setCurrentWordIndex(currentWordIndex + 1);
    }
  }

  function decrement(e) {
    if (!e) e = window.event;
    e.stopPropagation();
    currentWordIndex !== 0
      ? setCurrentWordIndex(currentWordIndex - 1)
      : showAlert(true, "The first item.");
  }

  const handleStarredClick = (e) => {
    let starredListArray = starredList;
    if (!e) e = window.event;
    e.stopPropagation();
    if (!starred) {
      starredListArray.listWordsArray.unshift({
        word: currentWord.word,
        sourceLang: lang,
        targetLang: targetLang,
      });
      showAlert(true, "Saved to Starred");
    } else {
      starredListArray.listWordsArray = starredListArray.listWordsArray.filter(
        (starredObject) => starredObject.word !== currentWord.word
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
          (wordInfo) => wordInfo.word !== currentWord.word
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
      currentList.listWordsArray.unshift({
        word: currentWord.word,
        sourceLang: lang,
        targetLang: targetLang,
      });
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
        onClick={(e) => handleStarredClick(e)}
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
              icon={MY_LISTS_ICONS[index + 1].icon}
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
