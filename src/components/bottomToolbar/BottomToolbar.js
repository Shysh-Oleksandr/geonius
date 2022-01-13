import React, { useEffect, useReducer } from "react";
import { AiFillStar } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState } from "react/cjs/react.development";
import { useGlobalContext } from "./../../context";
import MyListBtn from "./../MyListBtn";
import "./bottomToolbar.css";

const ACTIONS = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
  RESET: "reset",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      if (
        state.currentWordIndex ===
        action.payload.currentCategoryWords.length - 1
      ) {
        return { ...state, isCategoryCompleted: true };
      }

      return {
        ...state,
        currentWordIndex: state.currentWordIndex + 1,
        isCategoryCompleted: false,
      };
    case ACTIONS.DECREMENT:
      if (state.currentWordIndex === 0) {
        return state;
      }
      return { ...state, currentWordIndex: state.currentWordIndex - 1 };
    case ACTIONS.RESET:
      return { ...state, currentWordIndex: 0 };
    default:
      return state;
  }
}

const BottomToolbar = ({ currentCategoryWords }) => {
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
    setMyLists,
    unknownUncertainList,
    setUnknownUncertainList,
  } = useGlobalContext();

  const [starred, setStarred] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    currentWordIndex: 0,
    isCategoryCompleted: false,
  });

  const currentWord = currentCategoryWords[state.currentWordIndex];

  useEffect(() => {
    if (state.currentWordIndex !== currentWordIndex) {
      console.log(state.currentWordIndex, currentWordIndex);
      setCurrentWordIndex(state.currentWordIndex);
      console.log("eff");
    }
    checkListsForWord();
  }, [state.currentWordIndex, currentCategoryWords]);

  function handleKeyPress(e) {
    if (e.key === "ArrowLeft" || e.key === "Backspace") {
      dispatch({ type: ACTIONS.DECREMENT });
    } else if (e.key === "ArrowRight" || e.key === "Enter") {
      dispatch({
        type: ACTIONS.INCREMENT,
        payload: {
          currentCategoryWords: currentCategoryWords,
          setIsCategoryCompleted: setIsCategoryCompleted,
        },
      });
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentCategoryWords]);

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

  useEffect(() => {
    console.log("curr w i eff");
    state.currentWordIndex = currentWordIndex;
  }, [currentWordIndex]);

  useEffect(() => {
    setIsCategoryCompleted(state.isCategoryCompleted);
  }, [state.isCategoryCompleted]);

  useEffect(() => {
    if (!isCategoryCompleted) {
      dispatch({ type: ACTIONS.RESET });
      state.isCategoryCompleted = false;
    }
  }, [currentCategory, isCategoryCompleted]);

  function checkListsForWord() {
    // For my lists.
    myAddedLists.map((myList) => {
      // Remove active from each one.
      myList.className = myList.className.replace(" active", "");
      // If the word is in a list, make the list active.
      if (myList.listWordsArray.includes(currentWord)) {
        myList.className += " active";
      }
    });
    // For the starred list.
    // If the word is in starred list then make starred active. Otherwise removes active.
    starredList.listWordsArray.includes(currentWord)
      ? setStarred(true)
      : setStarred(false);
  }

  const handleStarredClick = (starredListArray) => {
    if (!starred) {
      starredListArray.listWordsArray.unshift(currentWord);
    } else {
      starredListArray.listWordsArray = starredListArray.listWordsArray.filter(
        (word) => word !== currentWord
      );
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
    } else {
      clearMyLists();
      // Add the current word to the current list and make current list btn active.
      currentList.listWordsArray.unshift(currentWord);
      currentList.className += " active";
    }
    let unknownUncertainListArray = [
      ...getListData("Unknown").listWordsArray,
      ...getListData("Uncertain").listWordsArray,
    ];

    setUnknownUncertainList((prev) => {
      return { ...prev, listWordsArray: unknownUncertainListArray };
    });
  };

  return (
    <div className="bottom-toolbar">
      <MyListBtn
        className={`word__star ${starred && "active"}`}
        icon={<AiFillStar />}
        onClick={() => handleStarredClick(starredList)}
      />

      <button
        type="button"
        className="bottom-toolbar__arrow-back bottom-toolbar__arrow"
        onClick={() => dispatch({ type: ACTIONS.DECREMENT })}
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
        onClick={() =>
          dispatch({
            type: ACTIONS.INCREMENT,
            payload: {
              currentCategoryWords: currentCategoryWords,
              setIsCategoryCompleted: setIsCategoryCompleted,
            },
          })
        }
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default BottomToolbar;
