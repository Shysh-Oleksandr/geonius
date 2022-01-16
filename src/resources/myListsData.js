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
const myListsData = [
  {
    listIndex: 0,
    listName: MY_LISTS_NAMES.UNKNOWN_UNCERTAIN,
    className: "unknown-uncertain-icon",
    icon: <BsQuestionLg />,
    secondIcon: <CgShapeTriangle />,
    listWordsArray: [],
  },
  {
    listIndex: 1,
    listName: MY_LISTS_NAMES.UNKNOWN,
    className: "unknown-icon",
    icon: <BsQuestionLg />,
    listWordsArray: [],
  },
  {
    listIndex: 2,
    listName: MY_LISTS_NAMES.UNCERTAIN,
    className: "uncertain-icon",
    icon: <CgShapeTriangle />,
    listWordsArray: [],
  },
  {
    listIndex: 3,
    listName: MY_LISTS_NAMES.LEARNED,
    className: "learned-icon",
    icon: <IoMdCheckmark />,
    listWordsArray: [],
  },
  {
    listIndex: 4,
    listName: MY_LISTS_NAMES.STARRED,
    className: "favorites-icon",
    icon: <AiFillStar />,
    listWordsArray: [],
  },
];

export default myListsData;
