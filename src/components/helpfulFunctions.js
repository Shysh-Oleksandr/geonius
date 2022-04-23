import partOfSpeechShortForm from "../resources/partOfSpeechData";
// Randomly shuffle an array.
export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Highlight current word in a sentence.
export function highlightWord(word, string) {
  if (
    string.includes(` ${word} `) ||
    string.startsWith(word) ||
    string.endsWith(word)
  ) {
    const regex = new RegExp(`${word}`);
    return string.replace(
      regex,
      `<span className="higlighted-word">${word}</span>`
    );
  }
  return string;
}

// Convert part of speech into its short form.
export function convertPartOfSpeech(partOfSpeech) {
  let convertedString = "";
  if (!partOfSpeech) {
    return convertedString;
  }
  const values = Object.values(partOfSpeechShortForm);

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  values.forEach((value) => {
    if (value.some((v) => partOfSpeech.toLowerCase().includes(v))) {
      convertedString = getKeyByValue(partOfSpeechShortForm, value);
    }
  });

  return convertedString;
}

// Fetch translation for word or sentence from source language to target one.
export function fetchTranslation(word, targetLang, lang) {
  if (word === "") {
    word = "error";
  }
  return fetch(
    `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=${targetLang}%7C${lang}&q=${word}&mt=1&onlyprivate=0&de=a%40b.c`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host":
          "translated-mymemory---translation-memory.p.rapidapi.com",
        "x-rapidapi-key": "7d52c9a743msh7da5035302dcedep1e2d55jsn6d0d4e437b55",
      },
    }
  );
}

// Check fetching response.
export function checkResponse(response) {
  if (!response) return;
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}

// Filter word from all characters except letters and apostrophe.
export function filterWord(word) {
  let filteredWord = word.replace(/[^'’ a-zA-Z\u0400-\u04FF]/g, "");
  return filteredWord.trim() !== "" ? filteredWord : null;
}

// Get examples from word data.
export function getWordExamples(data) {
  let currentWord = data[0].word.toLowerCase();
  let wordExamplesLocal = data[0].meanings.map((item) => {
    let currentExample = item.definitions[0].example;
    if (!currentExample) {
      return;
    }
    currentExample = currentExample.toLowerCase();
    if (!currentExample.includes(`${currentWord}`)) {
      return {
        wordExample: currentExample,
      };
    }
    return {
      wordExample: highlightWord(`${currentWord}`, currentExample),
    };
  });
  wordExamplesLocal = wordExamplesLocal.filter((example) => example);

  return wordExamplesLocal;
}

// Get translations of examples for current word.
export function getWordExamplesTranslations(data, setWordExamples) {
  for (let i = 0; i < data.length; i++) {
    const wordExampleTranslation = data[i].responseData.translatedText;
    setWordExamples((prevWordExamples) => {
      let newWordExamples = prevWordExamples.map((prevWordExample) => {
        if (prevWordExamples.indexOf(prevWordExample) === i) {
          return {
            ...prevWordExample,
            wordExampleTranslation: wordExampleTranslation.replace(
              "&#39;",
              "'"
            ),
          };
        } else {
          return prevWordExample;
        }
      });
      return newWordExamples;
    });
  }
}

const MAX_SYNONYMS_TO_SHOW = 8;
// Get synonyms and antonyms of current word.
export function getSynonymsAntonyms(data) {
  let wordSynonyms = [];
  let wordAntonyms = [];
  data.meanings.map((item) => {
    item.definitions.map((definition) => {
      definition.synonyms.map((synonym) => wordSynonyms.push(synonym));
      definition.antonyms.map((antonym) => wordAntonyms.push(antonym));
    });
  });

  wordSynonyms = [...new Set(wordSynonyms)].slice(0, MAX_SYNONYMS_TO_SHOW);
  wordAntonyms = [...new Set(wordAntonyms)].slice(0, MAX_SYNONYMS_TO_SHOW);

  return [wordSynonyms, wordAntonyms];
}

export const playWordAudio = (e, wordAudio, phonetics) => {
  if (!e) e = window.event;
  e.stopPropagation();
  if (!phonetics[0] && !phonetics[0].audio) return;
  wordAudio.current && wordAudio.current.play();
};

export function filterWordTranslations(translations, lang, currentWordInfo) {
  let sortedArray = translations.sort((a, b) => {
    var wordCountA = a.split(" ").length;
    var wordCountB = b.split(" ").length;
    return wordCountA - wordCountB;
  });

  if (lang === "ru") {
    sortedArray = sortedArray.filter((translation) => {
      return (
        !translation.includes(currentWordInfo.word) || sortedArray.length === 1
      );
    });
  }

  return sortedArray;
}
