import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const Dropdown = React.memo(({ onSelectionChange }) => {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <select onChange={onSelectionChange}>
      {numbers.map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  );
});

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userInputs, setUserInputs] = useState([]);
  const [isCorrectAnswers, setIsCorrectAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(240); // Timer in seconds
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('/questions.txt');
      const text = await response.text();
      const lines = text.split('\n').filter((line) => line.trim() !== '');

      const tempQuestions = [];
      const tempAnswers = [];
      for (let i = 0; i < lines.length; i += 2) {
        tempQuestions.push(lines[i]);
        tempAnswers.push(lines[i + 1]);
      }

      setQuestions(tempQuestions);
      setAnswers(tempAnswers);
      setUserInputs(Array(tempQuestions.length).fill(''));
      setIsCorrectAnswers(Array(tempQuestions.length).fill(false));
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleInputChange = (index, value) => {
    if (gameOver) return;

    const updatedInputs = [...userInputs];
    updatedInputs[index] = value;
    if (value.trim().toLowerCase() === answers[index].trim().toLowerCase()) {
      const updatedCorrectAnswers = [...isCorrectAnswers];
      updatedCorrectAnswers[index] = true;
      setIsCorrectAnswers(updatedCorrectAnswers);
    }

    setUserInputs(updatedInputs);
  };

  const parseCsvData = (i, j) => {
    Papa.parse('questions.csv', {
      download: true,
      delimiter: ',',
      complete: (result) => {
        const data = result.data;
        const evenArr = [];
        const oddArr = [];
        for (let idx = i; idx <= j; idx++) {
          evenArr.push(data[idx][0]);
          oddArr.push(data[idx][1]);
        }
        setQuestions(evenArr);
        setAnswers(oddArr);
        setUserInputs(Array(20).fill(''));
        setIsCorrectAnswers(Array(20).fill(false));
      },
    });
  };

  const handleSelectionChange = (event) => {
    const selectedNumber = parseInt(event.target.value, 10);
    const start = selectedNumber * 20;
    const end = start + 20;
    setGameOver(false);
    setTimeLeft(240);
    parseCsvData(start, end);
  };

  const handleGiveUp = () => {
    setGameOver(true);
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        justifyContent: 'center',
        width: '75%',
        marginLeft: '12.5%',
      }}
    >
      <h1>Jetpunk Ripoff</h1>
      <p>Time Left: {timeLeft} seconds</p>
      <Dropdown onSelectionChange={handleSelectionChange} />
      <button onClick={handleGiveUp} disabled={gameOver}>
        Give Up
      </button>
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            marginTop: '20px',
          }}
        >
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <div style={{ padding: '10px', border: '1px solid #ccc' }}>
                {question}
              </div>
              <div style={{ border: '1px solid #ccc' }}>
                {gameOver && !isCorrectAnswers[index] ? (
                  <span style={{ color: 'red' }}>{answers[index]}</span>
                ) : (
                  <input
                    type="text"
                    value={userInputs[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{
                      width: '90%',
                      padding: '5px',
                      color: isCorrectAnswers[index] ? 'green' : 'black',
                    }}
                    disabled={gameOver || isCorrectAnswers[index]}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

