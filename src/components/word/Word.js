import { React, useEffect, useRef } from "react";
import { MdVolumeUp } from "react-icons/md";
import { useState } from "react/cjs/react.development";
import { useGlobalContext } from "../../context";
import "./word.css";
import { AiFillStar } from "react-icons/ai";
import partOfSpeechShortForm from "./partOfSpeechData";
import MyListBtn from "./../MyListBtn";

const Word = ({ currentWordIndex, currentCategoryWords }) => {
  const wordAudio = useRef(null);
  const maxSynonymsToShow = 8;
  const { targetLang, lang } = useGlobalContext();

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
            "c875bcdba9msha44d792f019588ap1c8fe9jsn34d1f030a24c",
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

    wordSynonyms = [...new Set(wordSynonyms)].slice(0, maxSynonymsToShow);
    wordAntonyms = [...new Set(wordAntonyms)].slice(0, maxSynonymsToShow);

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
    wordExamplesLocal = data[0].meanings.map((item) => {
      if (!item.definitions[0].example) {
        return;
      }
      if (
        !item.definitions[0].example.includes(`${data[0].word}`) &&
        !item.definitions[0].example.startsWith(data[0].word) &&
        !item.definitions[0].example.endsWith(data[0].word)
      ) {
        return {
          wordExample: item.definitions[0].example,
        };
      }
      return {
        wordExample: highlightWord(
          `${data[0].word}`,
          item.definitions[0].example
        ),
      };
    });
    if (wordExamplesLocal.includes(undefined)) {
      wordExamplesLocal = [];
    }

    return wordExamplesLocal;
  }

  function checkResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
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
    if (string.includes(word)) {
      const regex = new RegExp(`${word}`);
      return string.replace(
        regex,
        `<span class="higlighted-word">${word}</span>`
      );
    }
  }

  const playWordAudio = () => {
    if (!phonetics[0].audio) return;
    wordAudio.current.play();
  };

  const fetchWordInfo = (word, targetLang, lang) => {
    setIsWordLoading(true);
    let wordExamplesLocal;
    console.log(word);
    if (word === "") {
      word = "no";
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/${targetLang}/${word}`)
      .then((response) => checkResponse(response))
      .then(function (data) {
        setWordData(data[0]);
        console.log(data[0]);

        getSynonymsAntonyms(data[0]);

        wordExamplesLocal = getWordExamples(wordExamplesLocal, data);
        setWordExamples(wordExamplesLocal);
        // Fetch another API
        return fetchTranslation(word, targetLang, lang);
      })
      .then((response) => checkResponse(response))
      .then(function (userData) {
        let wordTranslations = [
          ...new Set(
            userData.matches.map((item) => item.translation.toLowerCase())
          ),
        ];
        setWordTranslations(wordTranslations);
        return Promise.all(
          wordExamplesLocal
            .map((item) => {
              return item.wordExample;
            })
            .map((wordExample) =>
              fetchTranslation(wordExample, targetLang, lang)
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
        setIsWordLoading(false);
      });
  };

  useEffect(() => {
    if (currentCategoryWords.length > 0) {
      fetchWordInfo(currentCategoryWords[currentWordIndex], targetLang, lang);
    }
  }, [currentWordIndex, currentCategoryWords]);
  const { word, meanings, phonetics } = wordData;

  if (isWordLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="word">
      <MyListBtn className={"word__star"} icon={<AiFillStar />} />
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
