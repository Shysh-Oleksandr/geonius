import { React, useEffect } from "react";
import { MdVolumeUp } from "react-icons/md";
import { useState } from "react/cjs/react.development";
import { useGlobalContext } from "./../context";

const Word = () => {
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

  const fetchWordInfo = (word, targetLang, lang) => {
    let wordExamplesLocal;
    setIsWordLoading(true);
    if (word === "") {
      word = "no";
    }
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/${targetLang}/${word}`)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          console.log("rej1");
          return Promise.reject(response);
        }
      })
      .then(function (data) {
        // Store the post data to a variable
        setWordData(data[0]);
        console.log(data[0]);

        let wordSynonyms = [];
        let wordAntonyms = [];
        data[0].meanings.map((item) => {
          item.definitions.map((definition) => {
            definition.synonyms.map((synonym) => wordSynonyms.push(synonym));
            definition.antonyms.map((antonym) => wordAntonyms.push(antonym));
          });
        });

        wordSynonyms = [...new Set(wordSynonyms)].slice(0, maxSynonymsToShow);
        wordAntonyms = [...new Set(wordAntonyms)].slice(0, maxSynonymsToShow);

        setWordSynonyms(wordSynonyms);
        setWordAntonyms(wordAntonyms);

        wordExamplesLocal = data[0].meanings.map((item) => {
          return { wordExample: item.definitions[0].example };
        });
        setWordExamples(wordExamplesLocal);

        // Fetch another API
        return fetchTranslation(word, targetLang, lang);
      })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          console.log("rej2");

          return Promise.reject(response);
        }
      })
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

        setIsWordLoading(false);
      })
      .catch(function (error) {
        console.warn(error);
        console.log("loading false");
        setIsWordLoading(false);
      });
  };

  useEffect(() => {
    fetchWordInfo("fire", targetLang, lang);
  }, []);
  const { word, meanings, phonetics } = wordData;

  if (isWordLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className="word__audio-container">
        <h2>{word}</h2>
        <h4>
          {phonetics[0].audio && <MdVolumeUp />}
          {phonetics[0].text}
          {phonetics[0].audio && (
            <audio controls src={phonetics[0].audio}></audio>
          )}
        </h4>
      </div>
      <div>
        <h5 className="word__part-of-speech">{meanings[0].partOfSpeech}</h5>
        <ol className="word__translations">
          {wordTranslations.map((translation, index) => {
            return (
              <li key={index} className="word__translation">
                {translation}
              </li>
            );
          })}
        </ol>
        {wordExamples && (
          <div className="word__examples">
            <h4 className="word__example-label">Examples</h4>
            {wordExamples.map((wordExample, index) => {
              return (
                <div key={index} className="word__example-container">
                  <h4 className="word__example">{wordExample.wordExample}</h4>
                  <h5 className="word__example-translation">
                    {wordExample.wordExampleTranslation}
                  </h5>
                </div>
              );
            })}
          </div>
        )}
        {wordSynonyms && (
          <div className="word__synonyms-container">
            <h4 className="word__synonyms-label">Synonyms</h4>
            <div className="word__synonyms">
              {wordSynonyms.map((word, index) => {
                return (
                  <div key={index} className="word__synonym">
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {wordAntonyms && (
          <div className="word__antonyms-container">
            <h4 className="word__antonyms-label">Antonyms</h4>
            <div className="word__antonyms">
              {wordAntonyms.map((word, index) => {
                return (
                  <div key={index} className="word__antonym">
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
