import { React, useEffect } from "react";
import { useGlobalContext } from "./../context";

const Word = () => {
  const { setLoading, targetLang, setWordData, wordData } = useGlobalContext();
  const fetchWordInfo = async (word, lang) => {
    console.log(word);
    if (word === "") {
      word = "no";
    }
    console.log("start waiting to resp");
    var response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${targetLang}/${word}`
    );
    console.log("get resp");
    if (response.status === 404) {
      response = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/no"
      );
    }
    const data = await response.json();
    console.log("get data");
    console.log("data is", data);
    setWordData(data[0]);
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
    console.log("eff");
    fetchWordInfo("ich", targetLang);
    // fetchTranslation("word", lang, targetLang);
  }, []);
  const { meanings, origin, phonetic, phonetics, word } = wordData;

  return (
    <div>
      <h2>Word is {word}</h2>
      <small>{phonetic}</small>
      {phonetics.map((item, index) => {
        return (
          <div style={{ display: "flex" }} key={index}>
            <h4>{item.text}</h4>
            <audio controls src={item.audio}></audio>
          </div>
        );
      })}
      <div>
        Meanings: <br />
        {meanings.map((item, index) => {
          return (
            <div key={index}>
              <h4>Part of Speech: {item.partOfSpeech}</h4>
              <h4>Definition: {item.definitions[0].definition}</h4>
              <h3>
                {item.definitions[0].example &&
                  `Example: ${item.definitions[0].example}`}
              </h3>
            </div>
          );
        })}
      </div>
      <p>{origin}</p>
    </div>
  );
};

export default Word;

{
  /* <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" placeholder="enter word" />
        <button type="submit">Find</button>
      </form> */
}

// const inputRef = useRef("hello");

// const handleSubmit = (event) => {
//   event.preventDefault();
//   fetchWordInfo(inputRef.current.value, lang);
// };
