import React, { useContext, useEffect, useState } from "react";
import { useLocalStorage } from "./components/LocalStorage";
import langs from "./resources/langData";
import levelsData from "./resources/levelsData";
import myListsData from "./resources/myListsData";

const AppContext = React.createContext();
export const MODES = {
  STUDY: "Study",
  SLIDE: "Slide",
  QUIZ: "Quiz",
  RANDOM: "Random",
};

const AppProvider = ({ children }) => {
  const listsNames = ["Unknown", "Uncertain", "Learned"];

  // States, saved in the local storage.
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

  // Other states.
  const [currentCategoryWords, setCurrentCategoryWords] = useState([]);
  const [alert, setAlert] = useState({ show: false, msg: "" });
  // States to check if any menus are open.
  const [isCategoryMenuOpened, setIsCategoryMenuOpened] = useState(false);
  const [isCategoryCompleted, setIsCategoryCompleted] = useState(false);
  const [isWordListOpened, setIsWordListOpened] = useState(false);
  const [isModeMenuOpened, setIsModeMenuOpened] = useState(false);
  // Chosen language states.
  const [currentWordSourceLang, setCurrentWordSourceLang] = useState("en");
  const [currentWordTargetLang, setCurrentWordTargetLang] = useState("de");
  // Special lists states.
  const [starredList, setStarredList] = useState(getListData("Starred"));
  const [unknownUncertainList, setUnknownUncertainList] = useState(
    getListData("Unknown + Uncertain")
  );
  const myListsArray = myLists.filter((myList) =>
    listsNames.includes(myList.listName)
  );
  const [myAddedLists, setMyAddedLists] = useState(myListsArray);
  // Quiz mode states.
  const [randomMode, setRandomMode] = useState(false);
  const [guess, setGuess] = useState({
    isGuessed: false,
    isCorrect: undefined,
  });
  const [showWordInfo, setShowWordInfo] = useState(false);

  function getListData(listName) {
    return myLists.find((list) => list.listName === listName);
  }

  // Language selection functions.
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

  // Functions for setting words to categories.
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

  // Other functions.
  const getLangName = (langCode) => {
    let foundLang = langs.find((lang) => lang.langCode === langCode);
    return foundLang.langName;
  };

  let currLangName = getLangName(lang);

  const showAlert = (show = false, msg = "") => {
    setAlert({ show, msg });
  };

  // Use effects.
  // Setting words for chosen language.
  useEffect(() => {
    if (isLangChosen) {
      setWords(langs.find((lang) => lang.langCode === targetLang).langWords);
    }
  }, []);

  // Defining categories when language is changed.
  useEffect(() => {
    if (isLangChosen) {
      defineWordsByLevel();
    }
  }, [words]);

  // Choosing random mode.
  useEffect(() => {
    if (randomMode) {
      const modesArray = [MODES.SLIDE, MODES.QUIZ];
      const randomElement =
        modesArray[Math.floor(Math.random() * modesArray.length)];
      setCurrentMode(randomElement);
    }
  }, [randomMode, currentWordIndex]);

  // Setting new category words each time current category is changed.
  useEffect(() => {
    setCurrentCategoryWords(getCategoryWords(currentCategory));
  }, [currentCategory]);

  // Returning states for global usage.
  return (
    <AppContext.Provider
      value={{
        words,
        isLangChosen,
        lang,
        targetLang,
        levels,
        myLists,
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
        currentWordTargetLang,
        showWordInfo,
        setCurrentWordIndex,
        setIsLangChosen,
        setCurrentCategory,
        setComboNumber,
        setCurrentMode,
        setMyLists,
        setCurrentWordSourceLang,
        showAlert,
        setShowWordInfo,
        setCurrentWordTargetLang,
        setGuess,
        setRandomMode,
        setAlert,
        getCategoryWords,
        setIsModeMenuOpened,
        setIsCategoryCompleted,
        setStarredList,
        setIsWordListOpened,
        setMyAddedLists,
        setUnknownUncertainList,
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
