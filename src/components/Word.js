import React from "react";

const Word = () => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" placeholder="enter word" />
        <button type="submit">Find</button>
      </form>
      <h2>{word}</h2>
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
// const [wordData, setWordData] = useState({
//   meanings: [],
//   origin: "",
//   phonetic: "",
//   phonetics: [],
//   word: "",
// });
// const inputRef = useRef("hello");

// const fetchWordInfo = async (word, lang) => {
//   setLoading(true);
//   if (word === "") {
//     word = "no";
//   }
//   var response = await fetch(
//     `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`
//   );
//   if (response.status === 404) {
//     response = await fetch(
//       "https://api.dictionaryapi.dev/api/v2/entries/en/no"
//     );
//   }
//   const data = await response.json();
//   setWordData(data[0]);
//   setLoading(false);
// };

// const fetchTranslation = async (word, lang, targetLang) => {
//   setLoading(true);
//   if (word === "") {
//     word = "love";
//   }
//   var response = await fetch(
//     `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=${lang}%7C${targetLang}&q=${word}&mt=1&onlyprivate=0&de=a%40b.c`,
//     {
//       method: "GET",
//       headers: {
//         "x-rapidapi-host":
//           "translated-mymemory---translation-memory.p.rapidapi.com",
//         "x-rapidapi-key":
//           "c875bcdba9msha44d792f019588ap1c8fe9jsn34d1f030a24c",
//       },
//     }
//   );
//   if (response.status === 404) {
//     response = await fetch(
//       `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=en%7Cen&q=Error&mt=1&onlyprivate=0&de=a%40b.c`,
//       {
//         method: "GET",
//         headers: {
//           "x-rapidapi-host":
//             "translated-mymemory---translation-memory.p.rapidapi.com",
//           "x-rapidapi-key":
//             "c875bcdba9msha44d792f019588ap1c8fe9jsn34d1f030a24c",
//         },
//       }
//     );
//   }
//   const data = await response.json();
//   setLoading(false);
// };

// useEffect(() => {
//   fetchWordInfo("hello", lang);
//   fetchTranslation("word", lang, targetLang);
// }, []);
// const { meanings, origin, phonetic, phonetics, word } = wordData;

// const handleSubmit = (event) => {
//   event.preventDefault();
//   fetchWordInfo(inputRef.current.value, lang);
// };
