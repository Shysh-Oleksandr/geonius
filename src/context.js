import React, { useContext, useEffect, useState } from "react";
import langs from "./resources/langData";
import levelsData from "./resources/levelsData";
import myListsData from "./resources/myListsData";
import { useLocalStorage } from "./components/LocalStorage";

const AppContext = React.createContext();
export const MODES = {
  STUDY: "Study",
  SLIDE: "Slide",
  QUIZ: "Quiz",
  RANDOM: "Random",
};

const AppProvider = ({ children }) => {
  const [myLists, setMyLists] = useLocalStorage("myLists", myListsData);
  const [levels, setLevels] = useLocalStorage("levels", levelsData);
  const [words, setWords] = useLocalStorage("words", []);
  const [currentCategory, setCurrentCategory] = useLocalStorage(
    "currentCategory",
    null
  );
  const [currentWordIndex, setCurrentWordIndex] = useLocalStorage(
    "currentWordIndex",
    0
  );
  const [comboNumber, setComboNumber] = useLocalStorage("comboNumber", 0);
  const [currentMode, setCurrentMode] = useLocalStorage(
    "currentMode",
    MODES.STUDY
  );
  const [isLangChosen, setIsLangChosen] = useLocalStorage(
    "isLangChosen",
    false
  );
  const [lang, setLang] = useLocalStorage("lang", "en");
  const [targetLang, setTargetLang] = useLocalStorage("targetLang", "de");

  const [loading, setLoading] = useState(false);
  const [currentCategoryWords, setCurrentCategoryWords] = useState([]);
  const [isCategoryMenuOpened, setIsCategoryMenuOpened] = useState(false);
  const [isCategoryCompleted, setIsCategoryCompleted] = useState(false);
  const [isWordListOpened, setIsWordListOpened] = useState(false);
  const [isModeMenuOpened, setIsModeMenuOpened] = useState(false);
  const [starredList, setStarredList] = useState(getListData("Starred"));
  const [currentWordSourceLang, setCurrentWordSourceLang] = useState("en");
  const [currentWordTargetLang, setCurrentWordTargetLang] = useState("de");
  const [unknownUncertainList, setUnknownUncertainList] = useState(
    getListData("Unknown + Uncertain")
  );
  const [alert, setAlert] = useState({ show: false, msg: "" });
  const [randomMode, setRandomMode] = useState(false);
  const [guess, setGuess] = useState({
    isGuessed: false,
    isCorrect: undefined,
  });
  const [showWordInfo, setShowWordInfo] = useState(false);

  const listsNames = ["Unknown", "Uncertain", "Learned"];
  const myListsArray = myLists.filter((myList) =>
    listsNames.includes(myList.listName)
  );
  const [myAddedLists, setMyAddedLists] = useState(myListsArray);

  function getListData(listName) {
    return myLists.find((list) => list.listName === listName);
  }

  // const [searchTerm, setSearchTerm] = useState("a");
  const selectCurrentLanguage = (event) => {
    let value = event.target.value;
    setLang(value);
  };

  const chooseLang = (lang) => {
    setIsCategoryMenuOpened(true);
    setTargetLang(lang.langCode);
    setCurrentCategory(null);
    setIsLangChosen(true);
    setWords(lang.langWords);
    setCurrentCategoryWords([]);
  };

  const levelsByWords = levels.map((level) => {
    return level.levelWordsNumber;
  });

  function defineWordsByLevel() {
    levelsByWords.reduce((prev, curr, index) => {
      if (curr > words.length) {
        curr = words.length;
      }
      let levelWordsArray = words.slice(prev, curr).map((word) => {
        return { word: word };
      });
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
  }

  const getLangName = (langCode) => {
    let foundLang = langs.find((lang) => lang.langCode === langCode);
    return foundLang.langName;
  };

  const getCategoryWords = (categoryName) => {
    let resultWords = [];
    if (!categoryName) {
      return resultWords;
    }

    let foundList = levels.find((level) => level.levelName === categoryName);

    if (foundList) {
      resultWords = foundList.levelWordsArray;
    } else {
      foundList = myLists.find((level) => level.listName === categoryName);
      resultWords = foundList.listWordsArray;
    }

    return resultWords;
  };

  let currLangName = getLangName(lang);

  const showAlert = (show = false, msg = "") => {
    setAlert({ show, msg });
  };

  useEffect(() => {
    if (isLangChosen) {
      setWords(langs.find((lang) => lang.langCode === targetLang).langWords);
    }
  }, []);

  useEffect(() => {
    if (isLangChosen) {
      defineWordsByLevel();
    }
  }, [words]);

  useEffect(() => {
    if (randomMode) {
      const modesArray = [MODES.SLIDE, MODES.QUIZ];
      const randomElement =
        modesArray[Math.floor(Math.random() * modesArray.length)];
      setCurrentMode(randomElement);
    }
  }, [randomMode, currentWordIndex]);

  useEffect(() => {
    setCurrentCategoryWords(getCategoryWords(currentCategory));
  }, [currentCategory]);

  return (
    <AppContext.Provider
      value={{
        words,
        isLangChosen,
        lang,
        targetLang,
        levels,
        myLists,
        loading,
        currentCategory,
        levelsByWords,
        currLangName,
        currentCategoryWords,
        isCategoryMenuOpened,
        isCategoryCompleted,
        currentWordIndex,
        isWordListOpened,
        starredList,
        unknownUncertainList,
        myAddedLists,
        isModeMenuOpened,
        currentMode,
        alert,
        comboNumber,
        randomMode,
        guess,
        currentWordSourceLang,
        showWordInfo,
        currentWordTargetLang,
        setCurrentWordSourceLang,
        showAlert,
        setShowWordInfo,
        setCurrentWordTargetLang,
        setGuess,
        setRandomMode,
        setComboNumber,
        setAlert,
        getCategoryWords,
        setCurrentMode,
        setIsModeMenuOpened,
        setIsCategoryCompleted,
        setStarredList,
        setMyLists,
        setIsWordListOpened,
        setCurrentWordIndex,
        setMyAddedLists,
        setLoading,
        setIsLangChosen,
        setUnknownUncertainList,
        setCurrentCategory,
        setCurrentCategoryWords,
        setIsCategoryMenuOpened,
        chooseLang,
        selectCurrentLanguage,
        getListData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
