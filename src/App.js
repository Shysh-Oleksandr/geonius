import Categories from "./components/categories/Categories";
import LanguageSelection from "./components/LanguageSelection";
import Toolbar from "./components/toolbar/Toolbar";
import { useGlobalContext } from "./context";
import "./styles.css";

function App() {
  const {
    loading,
    isLangChosen,
    isCategoryMenuOpened,
    currentCategory,
    currentCategoryWords,
  } = useGlobalContext();

  if (loading) {
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
    </div>
  );
}

export default App;
