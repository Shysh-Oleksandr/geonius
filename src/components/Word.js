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
