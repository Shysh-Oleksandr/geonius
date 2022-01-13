import React, { useRef, useEffect } from "react";
import { MdChromeReaderMode } from "react-icons/md";
import { MODES, useGlobalContext } from "./../../context";
import "./modeMenu.css";

const ModeMenu = () => {
  const { isModeMenuOpened, setIsModeMenuOpened, currentMode, setCurrentMode } =
    useGlobalContext();
  const ref = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isModeMenuOpened && ref.current && !ref.current.contains(e.target)) {
        setIsModeMenuOpened(false);
      }
    };

    document.addEventListener("mouseup", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mouseup", checkIfClickedOutside);
    };
  }, [isModeMenuOpened]);

  function setMode(e) {
    let modeName = e.target.textContent;
    setCurrentMode(modeName);
    setIsModeMenuOpened(false);
  }
  return (
    <div className={`mode-menu__wrapper`}>
      <div className="mode-menu" ref={ref}>
        <h3 className="mode-menu__title">
          <span>
            <MdChromeReaderMode />
          </span>{" "}
          Select mode
        </h3>
        <div className="mode-menu__words-container">
          {Object.values(MODES).map((mode, index) => {
            return (
              <h4
                key={index}
                className={`mode-menu__option ${
                  mode === currentMode && "active"
                }`}
                onClick={setMode}
              >
                {mode}
              </h4>
            );
          })}
        </div>
        <button
          className="mode-menu__cancel-btn"
          onClick={() => setIsModeMenuOpened(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ModeMenu;
