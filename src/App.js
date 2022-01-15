import Categories from "./components/categories/Categories";
import LanguageSelection from "./components/LanguageSelection";
import Toolbar from "./components/toolbar/Toolbar";
import { MODES, useGlobalContext } from "./context";
import "./styles.css";
import WordsLearning from "./components/wordsLearning/WordsLearning";
import BottomToolbar from "./components/bottomToolbar/BottomToolbar";
import CategoryCompletedModal from "./components/categoryCompletedModal/CategoryCompletedModal";
import WordList from "./components/wordList/WordList";
import ModeMenu from "./components/modeMenu/ModeMenu";
import Alert from "./components/alert/Alert";

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
    <div className="main">
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
