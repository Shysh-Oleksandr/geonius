import React from "react";
import Word from "./../word/Word";
import "./wordsLearning.css";
import { useGlobalContext } from "./../../context";

const WordsLearning = () => {
  const { currentCategoryWords, currentWordIndex } = useGlobalContext();
  return (
    <div className="words-learning">
      <Word
        currentCategoryWords={currentCategoryWords}
        currentWordIndex={currentWordIndex}
      />
    </div>
  );
};

export default WordsLearning;
