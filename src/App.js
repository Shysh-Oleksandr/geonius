import Categories from "./components/categories/Categories";
import LanguageSelection from "./components/LanguageSelection";
import Toolbar from "./components/toolbar/Toolbar";
import { useGlobalContext } from "./context";
import "./styles.css";
import WordsLearning from "./components/wordsLearning/WordsLearning";
import BottomToolbar from "./components/bottomToolbar/BottomToolbar";
import CategoryCompletedModal from "./components/categoryCompletedModal/CategoryCompletedModal";
import WordList from "./components/wordList/WordList";

function App() {
  const {
    loading,
    isLangChosen,
    isCategoryMenuOpened,
    currentCategory,
    currentCategoryWords,
    isWordListOpened,
    isCategoryCompleted,
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
      {isCategoryMenuOpened && <Categories />}
      {isWordListOpened && (
        <WordList currentCategoryWords={currentCategoryWords} />
      )}
      <WordsLearning />
      {isCategoryCompleted && <CategoryCompletedModal />}
      <BottomToolbar currentCategoryWords={currentCategoryWords} />
    </div>
  );
}

export default App;
