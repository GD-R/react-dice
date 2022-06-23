import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Buttons from "./Buttons";

export default function Main() {
  const [rollCount, setRollCount] = useState(0);
  const [sec, setSec] = useState(new Date());
  const [timeTaken, setTimeTaken] = useState(0);

  function getSecondsBetweenDates(startDate, endDate) {
    let diff = endDate.getTime() - startDate.getTime();
    return Math.abs(diff / 1000);
  }

  const newDice = () => {
    return { value: Math.ceil(Math.random() * 6), freeze: false, id: nanoid() };
  };

  const getArray = () => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(newDice());
    }
    return arr;
  };

  const [dice, setDice] = useState(getArray());
  const [tenzi, setTenzi] = useState(false);
  const [score, setScore] = useState(
    JSON.parse(localStorage.getItem("score")) || []
  );

  useEffect(() => {
    setSec(new Date());
    if (timeTaken > 0 && score.length >= 0) {
      const arr = [...score];
      arr.push({ rollCount: rollCount, timeTaken: timeTaken });
      arr.sort((a, b) => {
        return a.timeTaken - b.timeTaken;
      });
      localStorage.setItem("score", JSON.stringify(arr));
      setScore(arr);
    }
  }, [timeTaken]);

  useEffect(() => {
    const allFreeze = dice.every((item) => item.freeze);
    const firstValue = dice[0].value;
    const allValue = dice.every((item) => item.value === firstValue);
    if (allFreeze && allValue) {
      const present = new Date();
      setTimeTaken(getSecondsBetweenDates(sec, present));
      setTenzi(true);
    }
  }, [dice]);

  const rollDice = () => {
    if (!tenzi) {
      setDice((previous) => {
        return previous.map((item) => {
          return item.freeze ? item : newDice();
        });
      });
      setRollCount((previous) => ++previous);
    } else {
      setRollCount(0);
      setTimeTaken(0);
      setTenzi(false);
      setDice(getArray());
    }
  };

  const updateFreeze = (id) => {
    setDice((previous) => {
      return previous.map((item) => {
        return id === item.id ? { ...item, freeze: !item.freeze } : item;
      });
    });
  };

  const allButtons = dice.map((item) => {
    return (
      <Buttons
        click={tenzi}
        num={item.value}
        key={item.id}
        freeze={item.freeze}
        updateFreeze={() => updateFreeze(item.id)}
      />
    );
  });

  return (
    <div className="bg-black h-[100vh]  md:h-[100%] flex items-center">
      {tenzi && <Confetti />}
      <div className="container lg:h-[100vh] w-[70vw] lg:w-[60vw] md:h-[100vh] h-[90%] mx-auto rounded border-8 border-sky-500 p-11 bg-black">
        <h2 className="text-2xl text-center text-white my-2">Tenzies</h2>
        <p className="text-lg text-center text-white">
          No. of rolls: <strong className="text-sky-500"> {rollCount} </strong>{" "}
          Time taken:{" "}
          <strong className="text-sky-500"> {tenzi && timeTaken} </strong>
        </p>
        {score.length > 0 && (
          <p className="text-lg text-center text-white">
            Your High Score is:{" "}
            <strong className="text-sky-500">{score[0].rollCount}</strong> rolls
            and <strong className="text-sky-500">{score[0].timeTaken} </strong>{" "}
            seconds{" "}
          </p>
        )}
        <div className="grid grid-cols-3 md:grid-cols-7 sm:grid-cols-3 lg:grid-cols-5 gap-0 justify-items-center my-4">
          {allButtons}
        </div>
        <div className="text-center">
          <button
            onClick={rollDice}
            className={`p-1 px-3 bg-transparent border-2 border-blue-500 text-blue-500 text-lg rounded-lg hover:bg-sky-500 hover:text-gray-100 active:bg-blue-500 active:text-gray-100 m-2`}
          >
            {tenzi ? "New Game" : "Roll Dice"}
          </button>
        </div>
      </div>
    </div>
  );
}
