import React, { useState, useContext, useEffect } from "react";
import englishWords from "./resources/languages/english";
import levelsData from "./resources/levelsData";
import myListsData from "./resources/myListsData";
import langs from "./resources/langData";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [levels, setLevels] = useState(levelsData);
  const [isLangChosen, setIsLangChosen] = useState(false);
  const [words, setWords] = useState(englishWords);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("es");
  const [myLists, setMyLists] = useState(myListsData);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentCategoryWords, setCurrentCategoryWords] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [isCategoryMenuOpened, setIsCategoryMenuOpened] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("a");

  const selectCurrentLanguage = (event) => {
    let value = event.target.value;
    setLang(value);
  };

  const chooseLang = (lang) => {
    setIsLangChosen(true);
    setTargetLang(lang.langCode);
    setWords(lang.langWords);
  };

  const levelsByWords = levels.map((level) => {
    return level.levelWordsNumber;
  });

  function defineWordsByLevel() {
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
  }

  const getLangName = (langCode) => {
    let foundLang = langs.find((lang) => lang.langCode === langCode);
    return foundLang.langName;
  };

  const getCategoryWords = (categoryName) => {
    if (!categoryName) {
      return [];
    }

    let foundLevel = levels.find((level) => level.levelName === categoryName);

    return foundLevel.levelWordsArray;
  };

  let currLangName = getLangName(lang);

  useEffect(() => {
    if (isLangChosen) {
      defineWordsByLevel();
    }
  }, [words]);

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
        currentList,
        loading,
        currentCategory,
        levelsByWords,
        currLangName,
        currentCategoryWords,
        isCategoryMenuOpened,
        setLoading,
        setIsLangChosen,
        setCurrentCategory,
        setIsCategoryMenuOpened,
        chooseLang,
        selectCurrentLanguage,
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
