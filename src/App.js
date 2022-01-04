import Categories from "./components/categories/Categories";
import LanguageSelection from "./components/LanguageSelection";
import Toolbar from "./components/toolbar/Toolbar";
import "./styles.css";
import { useGlobalContext } from "./context";

function App() {
  const { loading, isLangChosen } = useGlobalContext();

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
      <Toolbar />
      <Categories />
    </div>
  );
}

export default App;
