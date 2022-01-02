import { useEffect, useRef, useState } from "react";
import frenchWords from "./resources/french";
import englishWords from "./resources/english";
import germanWords from "./resources/german";
import spanishWords from "./resources/spanish";
import russianWords from "./resources/russian";

function App() {
  const inputRef = useRef("hello");
  const [wordData, setWordData] = useState({
    meanings: [],
    origin: "",
    phonetic: "",
    phonetics: [],
    word: "",
  });
  const [words, setWords] = useState(englishWords);
  const [loading, setLoading] = useState(true);

  let levels = [
    {
      levelIndex: 0,
      levelName: "A1",
      levelWordsNumber: 500,
    },
    {
      levelIndex: 1,
      levelName: "A2",
      levelWordsNumber: 1000,
    },
    {
      levelIndex: 2,
      levelName: "B1",
      levelWordsNumber: 2000,
    },
    {
      levelIndex: 3,
      levelName: "B2",
      levelWordsNumber: 4000,
    },
    {
      levelIndex: 4,
      levelName: "C1",
      levelWordsNumber: 10000,
    },
  ];

  const langs = [
    {
      langName: "English",
      langCode: "en",
      langWords: englishWords,
    },
    {
      langName: "German",
      langCode: "ge",
      langWords: germanWords,
    },
    {
      langName: "Spanish",
      langCode: "es",
      langWords: spanishWords,
    },
    {
      langName: "French",
      langCode: "fr",
      langWords: frenchWords,
    },
    {
      langName: "Russian",
      langCode: "ru",
      langWords: russianWords,
    },
  ];

  const levelsByWords = levels.map((level) => {
    return level.levelWordsNumber;
  });

  useEffect(() => {
    levelsByWords.reduce((prev, curr, index) => {
      if (curr > words.length) {
        curr = words.length;
      }
      let levelWordsArray = words.slice(prev, curr);
      levels[index].levelWordsArray = levelWordsArray;
      return curr;
    }, 0);
  }, []);

  let lang = "en";

  const fetchSearchedWord = async (word, lang) => {
    setLoading(true);
    if (word === "") {
      word = "no";
    }
    var response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`
    );
    if (response.status === 404) {
      response = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/no"
      );
    }
    const data = await response.json();
    setWordData(data[0]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSearchedWord("hello", lang);
  }, []);
  const { meanings, origin, phonetic, phonetics, word } = wordData;

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchSearchedWord(inputRef.current.value, lang);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" placeholder="enter word" />
        <button type="submit">Find</button>
      </form>
      <h2>{word}</h2>
      <small>{phonetic}</small>
      {phonetics.map((item, index) => {
        return (
          <div style={{ display: "flex" }} key={index}>
            <h4>{item.text}</h4>
            <audio controls src={item.audio}></audio>
          </div>
        );
      })}
      <div>
        Meanings: <br />
        {meanings.map((item, index) => {
          return (
            <div key={index}>
              <h4>Part of Speech: {item.partOfSpeech}</h4>
              <h4>Definition: {item.definitions[0].definition}</h4>
              <h3>
                {item.definitions[0].example &&
                  `Example: ${item.definitions[0].example}`}
              </h3>
            </div>
          );
        })}
      </div>
      <p>{origin}</p>
    </div>
  );
}

export default App;
