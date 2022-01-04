import {
  AiFillStar,
  BsQuestionLg,
  CgShapeTriangle,
  IoMdCheckmark,
} from "../components/categories/imports";

const myListsData = [
  {
    listIndex: 0,
    listName: "Unknown + Uncertain",
    className: "unknown-uncertain-icon",
    icon: <BsQuestionLg />,
    secondIcon: <CgShapeTriangle />,
    listWordsArray: [],
  },
  {
    listIndex: 1,
    listName: "Unknown",
    className: "unknown-icon",
    icon: <BsQuestionLg />,
    listWordsArray: [],
  },
  {
    listIndex: 2,
    listName: "Uncertain",
    className: "uncertain-icon",
    icon: <CgShapeTriangle />,
    listWordsArray: [],
  },
  {
    listIndex: 3,
    listName: "Learned",
    className: "learned-icon",
    icon: <IoMdCheckmark />,
    listWordsArray: [],
  },
  {
    listIndex: 4,
    listName: "Favorites",
    className: "favorites-icon",
    icon: <AiFillStar />,
    listWordsArray: [],
  },
];

export default myListsData;
