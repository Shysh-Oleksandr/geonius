import {
  franceIcon,
  germanIcon,
  spanishIcon,
  russianIcon,
  englishIcon,
} from "../assets/imports";
import {
  frenchWords,
  englishWords,
  germanWords,
  spanishWords,
  russianWords,
} from "./languages/imports";

const langs = [
  {
    langName: "English",
    langCode: "en",
    langWords: englishWords,
    flagIcon: englishIcon,
  },
  {
    langName: "German",
    langCode: "de",
    langWords: germanWords,
    flagIcon: germanIcon,
  },
  {
    langName: "Spanish",
    langCode: "es",
    langWords: spanishWords,
    flagIcon: spanishIcon,
  },
  {
    langName: "French",
    langCode: "fr",
    langWords: frenchWords,
    flagIcon: franceIcon,
  },
  {
    langName: "Russian",
    langCode: "ru",
    langWords: russianWords,
    flagIcon: russianIcon,
  },
];

export default langs;
