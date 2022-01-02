import { useEffect, useRef, useState } from "react";

import LanguageSelection from "./components/LanguageSelection";

import {
  franceIcon,
  germanIcon,
  spanishIcon,
  russianIcon,
  englishIcon,
} from "./assets/imports";
import {
  frenchWords,
  englishWords,
  germanWords,
  spanishWords,
  russianWords,
} from "./resources/imports";

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
  const [lang, setLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");

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
      flagIcon: englishIcon,
    },
    {
      langName: "German",
      langCode: "de",
      langWords: germanWords,
      flagIcon: germanIcon,
    },
    {
      langName: "Spanish",
      langCode: "es",
      langWords: spanishWords,
      flagIcon: spanishIcon,
    },
    {
      langName: "French",
      langCode: "fr",
      langWords: frenchWords,
      flagIcon: franceIcon,
    },
    {
      langName: "Russian",
      langCode: "ru",
      langWords: russianWords,
      flagIcon: russianIcon,
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

  const fetchWordInfo = async (word, lang) => {
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

  const fetchTranslation = async (word, lang, targetLang) => {
    setLoading(true);
    if (word === "") {
      word = "love";
    }
    var response = await fetch(
      `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=${lang}%7C${targetLang}&q=${word}&mt=1&onlyprivate=0&de=a%40b.c`,
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
    if (response.status === 404) {
      response = await fetch(
        `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=en%7Cen&q=Error&mt=1&onlyprivate=0&de=a%40b.c`,
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
    const data = await response.json();
    console.log(data.responseData.translatedText);
    setLoading(false);
  };

  useEffect(() => {
    fetchWordInfo("hello", lang);
    fetchTranslation("word", lang, targetLang);
  }, []);
  const { meanings, origin, phonetic, phonetics, word } = wordData;

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWordInfo(inputRef.current.value, lang);
  };

  const selectCurrentLanguage = (event) => {
    let value = event.target.value;
    setLang(value);
  };

  const getLangName = (langCode) => {
    let foundLang = langs.find((lang) => lang.langCode === langCode);
    return foundLang.langName;
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app">
      <LanguageSelection
        langs={langs}
        lang={getLangName(lang)}
        getLangName={getLangName}
        selectCurrentLanguage={selectCurrentLanguage}
      />
    </div>
  );
}

export default App;
