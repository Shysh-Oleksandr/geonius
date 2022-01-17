import Alert from "./components/alert/Alert";
import BottomToolbar from "./components/bottomToolbar/BottomToolbar";
import Categories from "./components/categories/Categories";
import CategoryCompletedModal from "./components/categoryCompletedModal/CategoryCompletedModal";
import ModeMenu from "./components/modeMenu/ModeMenu";
import Toolbar from "./components/toolbar/Toolbar";
import WordList from "./components/wordList/WordList";
import WordsLearning from "./components/wordsLearning/WordsLearning";
import { MODES, useGlobalContext } from "./context";
import "./styles.css";
import LanguageSelection from "./components/languageSelection/LanguageSelection";

function App() {
  const {
    loading,
    isLangChosen,
    isCategoryMenuOpened,
    currentCategory,
    currentCategoryWords,
    isWordListOpened,
    isCategoryCompleted,
    alert,
    currentMode,
    isModeMenuOpened,
    showAlert,
  } = useGlobalContext();

  if (loading) {
    console.log("load");
    return <h1>Loading...</h1>;
  }

  if (!isLangChosen) {
    return (
      <div className="app">
        <LanguageSelection />
      </div>
    );
  }

  return (
    <div className={`main ${isLangChosen ? "playing" : ""}`}>
      <Toolbar
        currentCategory={currentCategory}
        currentCategoryWords={currentCategoryWords}
      />
      {alert.show && (
        <Alert {...alert} removeAlert={showAlert} /> // dependency
      )}

      {isCategoryMenuOpened && <Categories />}
      {isWordListOpened && (
        <WordList currentCategoryWords={currentCategoryWords} />
      )}
      {isModeMenuOpened && <ModeMenu />}
      <WordsLearning />
      {isCategoryCompleted && <CategoryCompletedModal />}
      {currentMode !== MODES.QUIZ && (
        <BottomToolbar currentCategoryWords={currentCategoryWords} />
      )}
    </div>
  );
}

export default App;
