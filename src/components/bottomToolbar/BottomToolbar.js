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

const ACTIONS = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
  RESET: "reset",
  ADD_TO_LIST: "add-to-list",
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
    case ACTIONS.ADD_TO_LIST:
      // Find the current list(that was clicked).
      let currentList = action.payload.myLists.find(
        (myList) => myList.listName === action.payload.listName
      );

      // If the active list was clicked again, return unchanged state.
      if (currentList.className.includes("active")) {
        return state;
      }

      // Remove the current word and active class from each list.
      action.payload.myLists.map((myList) => {
        myList.className = myList.className.replace(" active", "");
        myList.listWordsArray = myList.listWordsArray.filter(
          (word) => word !== action.payload.currentWord
        );
      });

      // Add the current word to the current list and make current list btn active.
      currentList.listWordsArray.unshift(action.payload.currentWord);
      currentList.className += " active";

      return { ...state, myLists: action.payload.myLists };
    default:
      return state;
  }
}

const BottomToolbar = ({ currentCategoryWords }) => {
  const { setCurrentWordIndex, currentCategory } = useGlobalContext();

  const listsNames = ["Unknown", "Uncertain", "Learned"];
  const myListsArray = myListsData.filter((myList) =>
    listsNames.includes(myList.listName)
  );

  const [state, dispatch] = useReducer(reducer, {
    currentWordIndex: 0,
    myLists: myListsArray,
  });

  useEffect(() => {
    console.log(state.myLists);
    setCurrentWordIndex(state.currentWordIndex);
  }, [state]);

  useEffect(() => {
    dispatch({ type: ACTIONS.RESET });
    console.log(state.currentWordIndex);
  }, [currentCategory]);

  return (
    <div className="bottom-toolbar">
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
              onClick={() =>
                dispatch({
                  type: ACTIONS.ADD_TO_LIST,
                  payload: {
                    currentWord: currentCategoryWords[state.currentWordIndex],
                    listName: myList.listName,
                    myLists: state.myLists,
                  },
                })
              }
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
