import { React, useEffect, useRef } from "react";
import "./wordList.css";
import { useGlobalContext } from "./../../context";

const WordList = ({ currentCategoryWords }) => {
  const {
    setIsWordListOpened,
    isWordListOpened,
    currentWordIndex,
    setCurrentWordIndex,
    currentCategory,
  } = useGlobalContext();
  const ref = useRef();
  const wordsContainerRef = useRef();
  const activeWordRef = useRef();

  function setWordsContainerScroll() {
    let wordsContainerRect = wordsContainerRef.current.getBoundingClientRect();
    let activeWordRect = activeWordRef.current.getBoundingClientRect();
    let wordOffset = activeWordRect.top - wordsContainerRect.top;

    wordsContainerRef.current.scrollTop = wordOffset;
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isWordListOpened && ref.current && !ref.current.contains(e.target)) {
        setIsWordListOpened(false);
      }
    };

    setWordsContainerScroll();

    document.addEventListener("mouseup", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mouseup", checkIfClickedOutside);
    };
  }, [isWordListOpened]);

  function openClickedWord(e) {
    let wordIndex = currentCategoryWords.indexOf(e.target.textContent);
    setCurrentWordIndex(wordIndex);
    setIsWordListOpened(false);
  }
  return (
    <div className={`word-list__wrapper`}>
      <div className="word-list" ref={ref}>
        <h3 className="word-list__title">
          Word list ({currentCategoryWords.length})
        </h3>
        <div className="word-list__words-container" ref={wordsContainerRef}>
          {currentCategoryWords.map((word, index) => {
            return (
              <h4
                data-before={`${currentCategory} (${index + 1} / ${
                  currentCategoryWords.length
                })`}
                key={index}
                ref={
                  word === currentCategoryWords[currentWordIndex]
                    ? activeWordRef
                    : null
                }
                className={`word-list__word ${
                  word === currentCategoryWords[currentWordIndex] && "active"
                }`}
                onClick={openClickedWord}
              >
                {word}
              </h4>
            );
          })}
        </div>
        <button
          className="word-list__cancel-btn"
          onClick={() => setIsWordListOpened(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WordList;
