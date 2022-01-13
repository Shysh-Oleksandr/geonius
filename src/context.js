import React, { useContext, useEffect, useState } from "react";
import langs from "./resources/langData";
import levelsData from "./resources/levelsData";
import myListsData from "./resources/myListsData";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const starredListData = getListData("Starred");
  const unknownUncertainListData = getListData("Unknown + Uncertain");
  const listsNames = ["Unknown", "Uncertain", "Learned"];

  const myListsArray = myListsData.filter((myList) =>
    listsNames.includes(myList.listName)
  );

  const [levels, setLevels] = useState(levelsData);
  const [isLangChosen, setIsLangChosen] = useState(false);
  const [words, setWords] = useState([]);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("es");
  const [myLists, setMyLists] = useState(myListsData);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentCategoryWords, setCurrentCategoryWords] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [isCategoryMenuOpened, setIsCategoryMenuOpened] = useState(true);
  const [isCategoryCompleted, setIsCategoryCompleted] = useState(false);
  const [isWordListOpened, setIsWordListOpened] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [starredList, setStarredList] = useState(starredListData);
  const [myAddedLists, setMyAddedLists] = useState(myListsArray);
  const [unknownUncertainList, setUnknownUncertainList] = useState(
    unknownUncertainListData
  );
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

  function getListData(listName) {
    return myListsData.find((list) => list.listName === listName);
  }

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
        isCategoryCompleted,
        currentWordIndex,
        isWordListOpened,
        starredList,
        unknownUncertainList,
        myAddedLists,
        getCategoryWords,
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
