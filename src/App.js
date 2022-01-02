import { useEffect, useRef, useState } from "react";
import "./styles.css";

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
import Categories from "./components/categories/Categories";

function App() {
  const inputRef = useRef("hello");
  const [wordData, setWordData] = useState({
    meanings: [],
    origin: "",
    phonetic: "",
    phonetics: [],
    word: "",
  });

  let levelsData = [
    {
      levelIndex: 0,
      levelName: "A1 (Begginer 1)",
      levelWordsNumber: 500,
      levelWordsArray: [],
    },
    {
      levelIndex: 1,
      levelName: "A2 (Begginer 2)",
      levelWordsNumber: 1000,
      levelWordsArray: [],
    },
    {
      levelIndex: 2,
      levelName: "B1 (Intermediate 1)",
      levelWordsNumber: 2000,
      levelWordsArray: [],
    },
    {
      levelIndex: 3,
      levelName: "B2 (Intermediate 2)",
      levelWordsNumber: 4000,
      levelWordsArray: [],
    },
    {
      levelIndex: 4,
      levelName: "C1 (Advanced)",
      levelWordsNumber: 10000,
      levelWordsArray: [],
    },
  ];

  const [loading, setLoading] = useState(true);
  const [isLangChosen, setisLangChosen] = useState(false);
  const [words, setWords] = useState(englishWords);
  const [lang, setLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [levels, setLevels] = useState(levelsData);

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

      setLevels((prevLevels) => {
        let newLevels = prevLevels.map((prevLevel) => {
          if (prevLevel.levelIndex === index) {
            return { ...prevLevel, levelWordsArray: levelWordsArray };
          } else {
            return prevLevel;
          }
        });
        return newLevels;
      });

      return curr;
    }, 0);
  }, [words]);

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

  const chooseLang = (lang) => {
    setTargetLang(lang.langCode);
    setWords(lang.langWords);
    setisLangChosen(true);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isLangChosen) {
    return (
      <div className="app">
        <LanguageSelection
          langs={langs}
          lang={getLangName(lang)}
          selectCurrentLanguage={selectCurrentLanguage}
          chooseLang={chooseLang}
        />
      </div>
    );
  }

  return <Categories levels={levels} />;
}

export default App;
