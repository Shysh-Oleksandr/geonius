import React, { useEffect, useRef, useState } from "react";
import { MODES, useGlobalContext } from "../../context";
import { playWordAudio, shuffle } from "./../helpfulFunctions";
import bulbIcon from "../../assets/idea.png";
import BottomToolbar from "./../bottomToolbar/BottomToolbar";
import { IoIosArrowUp, IoMdCheckmark, IoMdClose } from "react-icons/io";
import { MdVolumeUp } from "react-icons/md";

const QuizWord = ({
  wordData,
  wordTranslations,
  wordExamples,
  wordSynonyms,
  wordAntonyms,
}) => {
  const {
    currentWordIndex,
    levels,
    currentMode,
    guess,
    comboNumber,
    setGuess,
    setComboNumber,
    showWordInfo,
    currentCategoryWords,
    setShowWordInfo,
    isCategoryCompleted,
  } = useGlobalContext();
  const OPTIONS_NUMBER = 4;
  const wordAudio = useRef(null);
  const currentWord = currentCategoryWords[currentWordIndex];
  const [quizOptions, setQuizOptions] = useState([
    { option: "", isHinted: false },
  ]);
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [chosenOption, setChosenOption] = useState(null);

  function generateQuizOptions() {
    // Reset guess and hint.
    setGuess({ isGuessed: false, isCorrect: undefined });
    setShowWordInfo(false);
    setIsHintUsed(false);
    // At start quiz options contain only the current word.
    let generatedQuizOptions = [currentWord.word];
    // If current category has less than 16 words than randomly choose another one.
    let categoryToChoose = currentCategoryWords;
    if (categoryToChoose.length < 16) {
      categoryToChoose =
        levels[Math.floor(Math.random() * levels.length)].levelWordsArray;
    }
    for (let i = 0; i < OPTIONS_NUMBER - 1; i++) {
      let randomOption;
      // While option isn't unique, randomly choose another one.
      do {
        randomOption =
          categoryToChoose[Math.floor(Math.random() * categoryToChoose.length)]
            .word;
      } while (generatedQuizOptions.includes(randomOption));
      // Then add it to the array.
      generatedQuizOptions.push(randomOption);
    }
    generatedQuizOptions = shuffle(generatedQuizOptions);
    generatedQuizOptions = generatedQuizOptions.map((el) => {
      return { option: el };
    });
    setQuizOptions(generatedQuizOptions);
  }

  function checkOption(e) {
    let chosenOption = e.target.textContent;
    setChosenOption(chosenOption);
    if (chosenOption === currentWord.word) {
      setGuess({ isGuessed: true, isCorrect: true });
      setComboNumber(comboNumber + 1);
    } else {
      setGuess({ isGuessed: true, isCorrect: false });
      setComboNumber(0);
    }
  }

  useEffect(() => {
    if (
      currentMode === MODES.QUIZ &&
      currentCategoryWords.length !== 0 &&
      !isCategoryCompleted
    ) {
      generateQuizOptions();
    }
  }, [
    currentMode,
    currentWordIndex,
    currentCategoryWords,
    isCategoryCompleted,
  ]);

  useEffect(() => {
    if (
      currentMode === MODES.QUIZ &&
      currentCategoryWords.length !== 0 &&
      guess.replay
    ) {
      generateQuizOptions();
    }
  }, [guess]);

  function handleHint() {
    setQuizOptions((prev) => {
      let randomOption;
      do {
        randomOption = prev[Math.floor(Math.random() * prev.length)].option;
      } while (randomOption === currentWord.word);
      let newOptions = prev.map((option) => {
        if (option.option === randomOption) {
          return { option: option.option, isHinted: true };
        } else {
          return option;
        }
      });
      return newOptions;
    });
    setIsHintUsed(true);
  }

  return (
    <div className="word quiz">
      <h2 className="word__translation">{wordTranslations[0]}</h2>
      <div className="quiz__options-container">
        <div className="quiz__hint-container">
          {!isHintUsed && (
            <button className="quiz__hint" onClick={handleHint}>
              <img src={bulbIcon} alt="" />
            </button>
          )}
        </div>
        <div className="quiz__options">
          {quizOptions.map((option, index) => {
            return (
              <button
                key={index}
                className={`quiz__option ${option.isHinted ? "is-hinted" : ""}`}
                type="button"
                onClick={!option.isHinted ? checkOption : null}
              >
                {option.option}
              </button>
            );
          })}
        </div>
      </div>
      {guess.isGuessed && <div className="dark-bg"></div>}
      <div
        onClick={() => setShowWordInfo(true)}
        className={`quiz__word-modal ${guess.isGuessed ? "show" : "hide"} ${
          guess.isCorrect || showWordInfo ? "correct" : "wrong"
        } ${showWordInfo ? "full-info" : ""}`}
      >
        {!showWordInfo && (
          <span className="quiz__arrow-up">
            <IoIosArrowUp />
          </span>
        )}
        <div className="quiz__modal-full-top">
          <div className="quiz__word-modal-top">
            <div className="quiz__combo">
              Combo
              <br />
              <span>{comboNumber}</span>
            </div>
            {(!showWordInfo || guess.isCorrect) && (
              <div className="quiz__correct-icon">
                {guess.isCorrect ? <IoMdCheckmark /> : <IoMdClose />}
              </div>
            )}
          </div>
          <div className="quiz__short-info">
            {guess.isCorrect || showWordInfo ? (
              <div
                onClick={(e) => playWordAudio(e, wordAudio, wordData.phonetics)}
                className={`word__audio-container ${
                  wordData.phonetics[0].audio && "has-audio"
                }`}
              >
                <h2 className="word__label">{wordData.word}</h2>
                <h2 className="word__translation word__translation-top">
                  {wordTranslations[0]}
                </h2>
                <h4 className="word__phonetic">
                  {wordData.phonetics[0].audio && <MdVolumeUp />}
                  {wordData.phonetics[0].text}
                  {wordData.phonetics[0].audio && (
                    <audio
                      ref={wordAudio}
                      src={wordData.phonetics[0].audio}
                    ></audio>
                  )}
                </h4>
              </div>
            ) : (
              <h2 className="word__label wrong-option">{chosenOption}</h2>
            )}
          </div>
        </div>
        {showWordInfo && (
          <div className="quiz__additional-info">
            <ol className="word__translations">
              <h4 className="word__example-label">Definitions</h4>
              {wordTranslations.map((translation, index) => {
                return (
                  <li key={index} className="word__translation">
                    {translation}
                  </li>
                );
              })}
            </ol>
            <div className="word__usage">
              {wordExamples.length > 0 && (
                <div className="word__examples">
                  <h4 className="word__example-label">Examples</h4>
                  {wordExamples.map((wordExample, index) => {
                    return (
                      <div key={index} className="word__example-container">
                        <h4
                          className="word__example"
                          dangerouslySetInnerHTML={{
                            __html: wordExample.wordExample,
                          }}
                        ></h4>
                        <h5
                          className="word__example-translation"
                          dangerouslySetInnerHTML={{
                            __html: wordExample.wordExampleTranslation,
                          }}
                        ></h5>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="word__synonyms-antonyms">
                {wordSynonyms.length > 0 && (
                  <div className="word__synonyms-container">
                    <h4 className="word__synonyms-label">Synonyms</h4>
                    <p className="word__synonyms">
                      {wordSynonyms.map((word, index) => {
                        if (index === wordSynonyms.length - 1) {
                          return `${word}`;
                        }
                        return `${word}, `;
                      })}
                    </p>
                  </div>
                )}
                {wordAntonyms.length > 0 && (
                  <div className="word__antonyms-container">
                    <h4 className="word__antonyms-label">Antonyms</h4>
                    <p className="word__antonyms">
                      {wordAntonyms.map((word, index) => {
                        if (index === wordAntonyms.length - 1) {
                          return `${word}`;
                        }
                        return `${word}, `;
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <BottomToolbar
          currentCategoryWords={currentCategoryWords}
          isCorrect={guess.isCorrect}
          setGuess={setGuess}
          setShowWordInfo={setShowWordInfo}
          showWordInfo={showWordInfo}
          guess={guess}
        />
      </div>
    </div>
  );
};

export default QuizWord;
