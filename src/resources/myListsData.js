import {
  AiFillStar,
  BsQuestionLg,
  CgShapeTriangle,
  IoMdCheckmark,
} from "../components/categories/imports";

export const MY_LISTS_NAMES = {
  UNKNOWN_UNCERTAIN: "Unknown + Uncertain",
  UNKNOWN: "Unknown",
  UNCERTAIN: "Uncertain",
  LEARNED: "Learned",
  STARRED: "Starred",
};

export const MY_LISTS_ICONS = [
  {
    icon: <BsQuestionLg />,
    secondIcon: <CgShapeTriangle />,
  },
  { icon: <BsQuestionLg /> },
  { icon: <CgShapeTriangle /> },
  { icon: <IoMdCheckmark /> },
  { icon: <AiFillStar /> },
];

const myListsData = [
  {
    listIndex: 0,
    listName: MY_LISTS_NAMES.UNKNOWN_UNCERTAIN,
    className: "unknown-uncertain-icon",
    listWordsArray: [],
  },
  {
    listIndex: 1,
    listName: MY_LISTS_NAMES.UNKNOWN,
    className: "unknown-icon",
    listWordsArray: [],
  },
  {
    listIndex: 2,
    listName: MY_LISTS_NAMES.UNCERTAIN,
    className: "uncertain-icon",
    listWordsArray: [],
  },
  {
    listIndex: 3,
    listName: MY_LISTS_NAMES.LEARNED,
    className: "learned-icon",
    listWordsArray: [],
  },
  {
    listIndex: 4,
    listName: MY_LISTS_NAMES.STARRED,
    className: "favorites-icon",
    listWordsArray: [],
  },
];

export default myListsData;
