import { React, useEffect, useRef } from "react";
import { MdVolumeUp } from "react-icons/md";
import { useState } from "react/cjs/react.development";
import { useGlobalContext } from "../../context";
import { MODES } from "./../../context";
import partOfSpeechShortForm from "./partOfSpeechData";
import "./word.css";
import bulbIcon from "../../assets/idea.png";
import { IoIosArrowUp, IoMdClose, IoMdCheckmark } from "react-icons/io";
import BottomToolbar from "./../bottomToolbar/BottomToolbar";

const Word = ({ currentWordIndex, currentCategoryWords }) => {
  const wordAudio = useRef(null);
  const MAX_SYNONYMS_TO_SHOW = 8;
  const OPTIONS_NUMBER = 4;
  const currentWord = currentCategoryWords[currentWordIndex];
  const {
    targetLang,
    lang,
    setCurrentWordIndex,
    setIsCategoryCompleted,
    levels,
    currentMode,
    guess,
    comboNumber,
    setGuess,
    setComboNumber,
    setCurrentWordSourceLang,
    showWordInfo,
    setCurrentWordTargetLang,
    setShowWordInfo,
  } = useGlobalContext();

  const [quizOptions, setQuizOptions] = useState([
    { option: "", isHinted: false },
  ]);
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [chosenOption, setChosenOption] = useState(null);

  const [wordTranslations, setWordTranslations] = useState([]);
  const [wordData, setWordData] = useState({
    meanings: [],
    phonetics: [],
    word: "",
  });
  const [wordExamples, setWordExamples] = useState([
    {
      wordExample: "",
      wordExampleTranslation: "",
    },
  ]);
  const [wordAntonyms, setWordAntonyms] = useState([]);
  const [wordSynonyms, setWordSynonyms] = useState([]);
  const [isWordLoading, setIsWordLoading] = useState(true);

  function fetchTranslation(word, targetLang, lang) {
    if (word === "") {
      word = "error";
    }
    return fetch(
      `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=${targetLang}%7C${lang}&q=${word}&mt=1&onlyprivate=0&de=a%40b.c`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "translated-mymemory---translation-memory.p.rapidapi.com",
          "x-rapidapi-key":
            "db4d8beb51mshf5068d8121f2d4ap112da4jsne8342999e57f",
        },
      }
    );
  }

  function getSynonymsAntonyms(data) {
    let wordSynonyms = [];
    let wordAntonyms = [];
    data.meanings.map((item) => {
      item.definitions.map((definition) => {
        definition.synonyms.map((synonym) => wordSynonyms.push(synonym));
        definition.antonyms.map((antonym) => wordAntonyms.push(antonym));
      });
    });

    wordSynonyms = [...new Set(wordSynonyms)].slice(0, MAX_SYNONYMS_TO_SHOW);
    wordAntonyms = [...new Set(wordAntonyms)].slice(0, MAX_SYNONYMS_TO_SHOW);

    setWordSynonyms(wordSynonyms);
    setWordAntonyms(wordAntonyms);
  }

  function getWordExamplesTranslations(data) {
    for (let i = 0; i < data.length; i++) {
      const wordExampleTranslation = data[i].responseData.translatedText;
      setWordExamples((prevWordExamples) => {
        let newWordExamples = prevWordExamples.map((prevWordExample) => {
          if (prevWordExamples.indexOf(prevWordExample) === i) {
            return {
              ...prevWordExample,
              wordExampleTranslation: wordExampleTranslation.replace(
                "&#39;",
                "'"
              ),
            };
          } else {
            return prevWordExample;
          }
        });
        return newWordExamples;
      });
    }
  }

  function getWordExamples(wordExamplesLocal, data) {
    let currentWord = data[0].word.toLowerCase();
    wordExamplesLocal = data[0].meanings.map((item) => {
      let currentExample = item.definitions[0].example;
      if (!currentExample) {
        return;
      }
      currentExample = currentExample.toLowerCase();
      if (!currentExample.includes(`${currentWord}`)) {
        return {
          wordExample: currentExample,
        };
      }
      return {
        wordExample: highlightWord(`${currentWord}`, currentExample),
      };
    });
    wordExamplesLocal = wordExamplesLocal.filter((example) => example);

    return wordExamplesLocal;
  }

  function convertPartOfSpeech(partOfSpeech) {
    let convertedString = "";
    if (!partOfSpeech) {
      return convertedString;
    }
    const values = Object.values(partOfSpeechShortForm);

    function getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    }

    values.forEach((value) => {
      if (value.some((v) => partOfSpeech.toLowerCase().includes(v))) {
        convertedString = getKeyByValue(partOfSpeechShortForm, value);
      }
    });

    return convertedString;
  }

  function highlightWord(word, string) {
    if (
      string.includes(` ${word} `) ||
      string.startsWith(word) ||
      string.endsWith(word)
    ) {
      const regex = new RegExp(`${word}`);
      return string.replace(
        regex,
        `<span className="higlighted-word">${word}</span>`
      );
    }
    return string;
  }

  const playWordAudio = () => {
    if (!phonetics[0].audio) return;
    wordAudio.current.play();
  };

  function filterWord(word) {
    let filteredWord = word.replace(/[^'’ a-zA-Z\u0400-\u04FF]/g, "");
    return filteredWord.trim() !== "" ? filteredWord : null;
  }

  function checkResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }

  const fetchWordInfo = (wordInfo) => {
    const word = wordInfo.word;
    const wordSourceLang = wordInfo.sourceLang || lang;
    const wordTargetLang = wordInfo.targetLang || targetLang;
    setCurrentWordSourceLang(wordSourceLang);
    setCurrentWordTargetLang(wordTargetLang);
    setIsWordLoading(true);
    let wordExamplesLocal;

    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${wordTargetLang}/${word}`
    )
      .then((response) => checkResponse(response))
      .then(function (data) {
        data[0].word = filterWord(data[0].word);
        setWordData(data[0]);

        getSynonymsAntonyms(data[0]);

        wordExamplesLocal = getWordExamples(wordExamplesLocal, data);
        setWordExamples(wordExamplesLocal);

        // Fetch another API
        return fetchTranslation(word, wordTargetLang, wordSourceLang);
      })
      .then((response) => checkResponse(response))
      .then(function (userData) {
        let wordTranslations = [
          ...new Set(
            userData.matches
              .map((item) => {
                let filteredTranslation = filterWord(
                  item.translation.toLowerCase()
                );
                return filteredTranslation;
              })
              .filter((item) => item)
          ),
        ];

        setWordTranslations(wordTranslations);

        return Promise.all(
          wordExamplesLocal
            .map((item) => {
              return item.wordExample;
            })
            .map((wordExample) =>
              fetchTranslation(wordExample, wordTargetLang, wordSourceLang)
            )
        );
      })
      .then(function (responses) {
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );
      })
      .then(function (data) {
        getWordExamplesTranslations(data);
        setIsWordLoading(false);
      })
      .catch(function (error) {
        console.warn(error);
        setCurrentWordIndex((prev) => {
          if (currentWordIndex === currentCategoryWords.length - 1) {
            setIsCategoryCompleted(true);
            return prev;
          }
          return prev + 1;
        });
      });
  };

  useEffect(() => {
    if (currentCategoryWords.length > 0) {
      fetchWordInfo(currentCategoryWords[currentWordIndex]);
    }
  }, [currentWordIndex, currentCategoryWords]);
  const { word, meanings, phonetics } = wordData;

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

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
    if (currentMode === MODES.QUIZ && currentCategoryWords.length !== 0) {
      generateQuizOptions();
    }
  }, [currentMode, currentWordIndex, currentCategoryWords]);

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
      } while (randomOption === currentWord);
      console.log(randomOption);
      let newOptions = prev.map((option) => {
        if (option.option === randomOption) {
          return { option: option.option, isHinted: true };
        } else {
          return option;
        }
      });
      console.log(newOptions);
      return newOptions;
    });
    setIsHintUsed(true);
  }

  if (isWordLoading) {
    return <h1>Loading...</h1>;
  }

  if (currentMode === MODES.QUIZ) {
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
                  className={`quiz__option ${
                    option.isHinted ? "is-hinted" : ""
                  }`}
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
                  onClick={playWordAudio}
                  className={`word__audio-container ${
                    phonetics[0].audio && "has-audio"
                  }`}
                >
                  <h2 className="word__label">{word}</h2>
                  <h2 className="word__translation word__translation-top">
                    {wordTranslations[0]}
                  </h2>
                  <h4 className="word__phonetic">
                    {phonetics[0].audio && <MdVolumeUp />}
                    {phonetics[0].text}
                    {phonetics[0].audio && (
                      <audio ref={wordAudio} src={phonetics[0].audio}></audio>
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
  }

  return (
    <div className="word">
      <div
        onClick={playWordAudio}
        className={`word__audio-container ${phonetics[0].audio && "has-audio"}`}
      >
        <h2 className="word__label">{word}</h2>
        <h4 className="word__phonetic">
          {phonetics[0].audio && <MdVolumeUp />}
          {phonetics[0].text}
          {phonetics[0].audio && (
            <audio ref={wordAudio} src={phonetics[0].audio}></audio>
          )}
        </h4>
      </div>

      <div>
        <h5 className="word__part-of-speech">
          {meanings.map((meaning) => {
            return `${convertPartOfSpeech(meaning.partOfSpeech)} `;
          })}
        </h5>
        <ol className="word__translations">
          {wordTranslations.map((translation, index) => {
            return (
              <li key={index} className="word__translation">
                {translation}
              </li>
            );
          })}
        </ol>
      </div>
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
  );
};

export default Word;

{
  /* <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" placeholder="enter word" />
        <button type="submit">Find</button>
      </form> */
}

// const inputRef = useRef("hello");

// const handleSubmit = (event) => {
//   event.preventDefault();
//   fetchWordInfo(inputRef.current.value, lang);
// };
