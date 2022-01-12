import React, { useReducer, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./bottomToolbar.css";
import MyListBtn from "./../MyListBtn";
import {
  IoMdCheckmark,
  CgShapeTriangle,
  BsQuestionLg,
} from "../categories/imports";
import { useGlobalContext } from "./../../context";
import myListsData from "./../../resources/myListsData";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react/cjs/react.development";

const ACTIONS = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
  RESET: "reset",
  ADD_TO_LIST: "add-to-list",
  STARRED: "starred",
  CHECK_WORD: "check-word",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      if (
        state.currentWordIndex === action.payload.currentCategoryWords.length
      ) {
        console.log("modal about ending categ");
        return state;
      }

      return { ...state, currentWordIndex: state.currentWordIndex + 1 };
    case ACTIONS.DECREMENT:
      if (state.currentWordIndex === 0) {
        return state;
      }
      return { ...state, currentWordIndex: state.currentWordIndex - 1 };
    case ACTIONS.RESET:
      return { ...state, currentWordIndex: 0 };
    case ACTIONS.CHECK_WORD:
      // For my lists.
      action.payload.myLists.map((myList) => {
        // Remove active from each one.
        myList.className = myList.className.replace(" active", "");

        // If the word is in a list, make the list active.
        if (myList.listWordsArray.includes(action.payload.currentWord)) {
          myList.className += " active";
        }
      });

      // For the starred list.
      // If the word is in starred list then make starred active.
      if (
        action.payload.starredList.listWordsArray.includes(
          action.payload.currentWord
        )
      ) {
        action.payload.setStarred(true);
      }
      // Otherwise, remove active.
      else {
        action.payload.setStarred(false);
      }
      return { ...state };

    default:
      return state;
  }
}

function getListData(listName) {
  return myListsData.find((list) => list.listName === listName);
}

const BottomToolbar = ({ currentCategoryWords }) => {
  const { setCurrentWordIndex, currentCategory } = useGlobalContext();

  const listsNames = ["Unknown", "Uncertain", "Learned"];
  const myListsArray = myListsData.filter((myList) =>
    listsNames.includes(myList.listName)
  );

  const starredListData = getListData("Starred");

  const unknownUncertainListData = getListData("Unknown + Uncertain");
  const [starredList, setStarredList] = useState(starredListData);
  const [myLists, setMyLists] = useState(myListsArray);
  const [unknownUncertainList, setUnknownUncertainList] = useState(
    unknownUncertainListData
  );
  const [starred, setStarred] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    currentWordIndex: 0,
    myLists: myListsArray,
    unknownUncertainList: unknownUncertainListData,
  });

  const currentWord = currentCategoryWords[state.currentWordIndex];

  useEffect(() => {
    setCurrentWordIndex(state.currentWordIndex);
    console.log(state.currentWordIndex, currentWord);
    console.log(currentCategoryWords);
    checkListsForWord();
  }, [state.currentWordIndex, currentCategoryWords]);

  useEffect(() => {
    dispatch({ type: ACTIONS.RESET });
  }, [currentCategory]);

  function checkListsForWord() {
    // For my lists.
    myLists.map((myList) => {
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
    let currentList = myLists.find((myList) => myList.listName === listName);

    // If the active list was clicked again, return unchanged state.
    if (currentList.className.includes("active")) {
      console.log("alre");
      return state;
    }
    // Remove the current word and active class from each list.
    myLists.map((myList) => {
      myList.className = myList.className.replace(" active", "");
      myList.listWordsArray = myList.listWordsArray.filter(
        (word) => word !== currentWord
      );
    });
    // Add the current word to the current list and make current list btn active.
    currentList.listWordsArray.unshift(currentWord);
    currentList.className += " active";

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
        {state.myLists.map((myList, index) => {
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
            payload: { currentCategoryWords: currentCategoryWords },
          })
        }
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default BottomToolbar;
