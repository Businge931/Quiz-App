import { useState, useEffect, useRef } from "react";

import "./App.css";
import Quiz from "./components/Quiz";
import Form from "./components/Form";
import { db } from "./firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import Results from "./components/Results";

function App() {
  const [questions, setQuestions] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [category, setCategory] = useState(null);
  const [quizName, setQuizname] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [gradingPoints, setGradingPoints] = useState(5);
  const [results, setResults] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeTaken: 0,
  });

  const timerRef = useRef(null);

  useEffect(() => {
    // return () => ;
  }, [activeQuestion, showResults]);

  const onStartQuiz = () => {
    const dbReference = collection(db, "questions");
    const unsub = onSnapshot(dbReference, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      const categories = results.filter(
        (result) => result.category === category
      );
      // console.log(categories);
      setQuestions(categories);
      setShowQuiz(true);
    });

    if (!showResults) {
      let timeLeft = 15;
      timerRef.current = setInterval(() => {
        if (timeLeft === 0) {
          clearInterval(timerRef.current);
          onClickNext();
        } else {
          timeLeft--;
          setResults((prev) => ({ ...prev, timeTaken: prev.timeTaken + 1 }));
        }
      }, 1000);
    }
    //remember to unsubscribe from database when component unmounts
    return () => {
      clearInterval(timerRef.current);
      unsub();
    };
  };

  const onAttemptAgain = () => {
    setQuizname("");
    setGradingPoints(null);
    setCategory(null);
    setShowResults(false);
    setShowQuiz(false);
  };

  const onEditQuiz = () => {
    setShowEditForm(true);
  };

  const onClickNext = () => {
    clearInterval(timerRef.current);
    setSelectedAnswerIndex(null);
    setResults((prevResults) =>
      selectedAnswer
        ? {
            ...prevResults,
            score: prevResults.score + +gradingPoints,
            correctAnswers: prevResults.correctAnswers + 1,
          }
        : { ...prevResults, wrongAnswers: prevResults.wrongAnswers + 1 }
    );

    if (questions && activeQuestion !== questions.length - 1) {
      setActiveQuestion((prevQtn) => prevQtn + 1);
    } else {
      setActiveQuestion(0);
      setShowResults(true);
    }
  };

  const onSelectAnswer = (answer, index) => {
    setSelectedAnswerIndex(index);
    if (questions && answer === questions[activeQuestion].correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
    }
  };

  return (
    <div className="App">
      <Form
        setCategory={setCategory}
        setGradingPoints={setGradingPoints}
        onStartQuiz={onStartQuiz}
        setQuizname={setQuizname}
        quizName={quizName}
      />
      {!showResults ? (
        <Quiz
          questions={questions}
          selectedAnswerIndex={selectedAnswerIndex}
          onClickNext={onClickNext}
          onSelectAnswer={onSelectAnswer}
          activeQuestion={activeQuestion}
          showQuiz={showQuiz}
        />
      ) : (
        <Results
          questions={questions}
          onAttemptAgain={onAttemptAgain}
          results={results}
          quizName={quizName}
          onEditQuiz={onEditQuiz}
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          setShowResults={setShowResults}
        />
      )}
      <p>{15 - results.timeTaken}s</p>
    </div>
  );
}

export default App;
