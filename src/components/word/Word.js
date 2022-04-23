import { React, useEffect, useRef, useState } from "react";
import CircularProgress from "react-cssfx-loading/lib/CircularProgress";
import { MdVolumeUp } from "react-icons/md";
import { useGlobalContext } from "../../context";
import {
  checkResponse,
  getSynonymsAntonyms,
  getWordExamples,
  getWordExamplesTranslations,
  convertPartOfSpeech,
  fetchTranslation,
  filterWord,
  playWordAudio,
} from "../helpfulFunctions";
import { MODES } from "./../../context";

import "./quiz.css";
import QuizWord from "./QuizWord";
import "./word.css";
import { filterWordTranslations } from "./../helpfulFunctions";

const Word = ({ currentWordIndex, currentCategoryWords }) => {
  const wordAudio = useRef(null);

  const {
    targetLang,
    lang,
    setCurrentWordIndex,
    setIsCategoryCompleted,
    currentMode,
    setCurrentWordSourceLang,
    setCurrentWordTargetLang,
  } = useGlobalContext();

  const currentWordInfo = currentCategoryWords[currentWordIndex];

  const [wordTranslations, setWordTranslations] = useState([]);
  const [wordData, setWordData] = useState({
    meanings: [],
    phonetics: [],
    word: "",
  });
  const [wordExamples, setWordExamples] = useState([]);
  const [wordAntonyms, setWordAntonyms] = useState([]);
  const [wordSynonyms, setWordSynonyms] = useState([]);
  const [isWordLoading, setIsWordLoading] = useState(true);

  function getWordTranslations(userData) {
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
    wordTranslations = filterWordTranslations(
      wordTranslations,
      lang,
      currentWordInfo
    );

    setWordTranslations(wordTranslations);
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
        // Get word data and set it to state.
        data[0].word = filterWord(data[0].word);
        setWordData(data[0]);

        // Get synonyms and antonyms and set them to states.
        let synonymsAndAntonyms = getSynonymsAntonyms(data[0]);
        setWordSynonyms(synonymsAndAntonyms[0]);
        setWordAntonyms(synonymsAndAntonyms[1]);

        // Get examples and set them to state.
        wordExamplesLocal = getWordExamples(data);
        setWordExamples(wordExamplesLocal);

        // Fetch another API
        return fetchTranslation(word, wordTargetLang, wordSourceLang);
      })
      .then((response) => checkResponse(response))
      .then(function (userData) {
        // Get translations of word, filter them and set them to state.
        getWordTranslations(userData);

        // Fetching translations for examples.
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
        getWordExamplesTranslations(data, setWordExamples);
        setIsWordLoading(false);
      })
      .catch(function (error) {
        console.warn(error);
        // wordTargetLang === "en" &&
        //   setCurrentWordIndex((prev) => {
        //     if (currentWordIndex === currentCategoryWords.length - 1) {
        //       setIsCategoryCompleted(true);
        //       return prev;
        //     }
        //     return prev + 1;
        //   });
        return fetchTranslation(word, wordTargetLang, wordSourceLang);
      })
      .then((response) => checkResponse(response))
      .then(function (userData) {
        if (!userData) return;
        // Get translations of word, filter them and set them to state.
        getWordTranslations(userData);
        // If an error occurs, fetch the next word untill there are words in category.

        setIsWordLoading(false);
      });
  };

  useEffect(() => {
    if (currentCategoryWords.length > 0) {
      fetchWordInfo(currentWordInfo);
    }
  }, [currentWordIndex, currentCategoryWords]);
  const { word, meanings, phonetics } = wordData;

  if (isWordLoading) {
    return (
      <div className="loading">
        <CircularProgress color="#22cff9" width="100%" height="100%" />
      </div>
    );
  }

  if (currentMode === MODES.QUIZ) {
    return (
      <QuizWord
        wordData={wordData}
        wordTranslations={wordTranslations}
        wordExamples={wordExamples}
        wordSynonyms={wordSynonyms}
        wordAntonyms={wordAntonyms}
      />
    );
  }

  return (
    <div className="word">
      {phonetics[0] ? (
        <div
          onClick={(e) => playWordAudio(e, wordAudio, phonetics)}
          className={`word__audio-container ${
            phonetics[0].audio && "has-audio"
          }`}
        >
          <h2 className="word__label">
            {/* If current word info isn't undefined, output its word, else word from wordData */}
            {currentWordInfo ? currentWordInfo.word : word}
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
        <div className="word__audio-container">
          <h2 className="word__label">
            {currentWordInfo ? currentWordInfo.word : word}
          </h2>
          <h4 className="word__phonetic"></h4>
        </div>
      )}

      <div>
        <h5 className="word__part-of-speech">
          {meanings &&
            meanings.map((meaning) => {
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
