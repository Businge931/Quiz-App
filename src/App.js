import { useState, useRef } from "react";

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
  const [isQuizPlaying, setIsQuizPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [category, setCategory] = useState(null);
  const [quizName, setQuizname] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gradingPoints, setGradingPoints] = useState(5);
  const [results, setResults] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeTaken: 0,
  });
  const [timer, setTimer] = useState(30);
  const [timerRef, setTimerRef] = useState(null);

  // const timerRef = useRef(null);

  const onStartQuiz = () => {
    setIsLoading(true);
    setIsQuizPlaying(true);
    const dbReference = collection(db, "questions");
    const unsub = onSnapshot(dbReference, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      const categories = results.filter(
        (result) => result.category === category
      );

      setQuestions(categories);
      setShowQuiz(true);
      setIsLoading(false);
      setTimer(30);
    });
    // setTimerRef(
    //   setInterval(() => {
    //     setTimer((prevTimer) => {
    //       if (prevTimer === 0) {
    //         onClickNext();
    //         console.log(prevTimer);
    //         return prevTimer;
    //       } else {
    //         return prevTimer - 1;
    //       }
    //     });
    //   }, 1000)
    // );

    //remember to unsubscribe from database when component unmounts
    return () => {
      clearInterval(timerRef.current);
      unsub();
    };
  };

  const onAttemptAgain = () => {
    setQuizname("");
    setGradingPoints("");
    setCategory(category);
    setShowResults(false);
    setShowQuiz(true);
    setResults({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeTaken: 0,
    });
    setIsQuizPlaying(true);
  };

  const onEditQuiz = () => {
    setShowEditForm(true);
    setIsQuizPlaying(true);
  };

  function onClickNext() {
    clearInterval(timerRef);
    setIsLoading(true);
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
      setShowEditForm(false);
      setIsQuizPlaying(false);
    }
    setIsLoading(false);
    setTimer(30);
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(timerInterval);
          onClickNext();
          return 30;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
    setTimerRef(timerInterval);
  }

  const onSelectAnswer = (answer, index) => {
    setSelectedAnswerIndex(index);
    if (questions && answer === questions[activeQuestion].correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
    }
  };

  const restartQuiz = () => {
    setQuizname("");
    setGradingPoints("");
    setCategory("");
    setShowQuiz(false);
    setIsQuizPlaying(false);
    setResults({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeTaken: 0,
    });
    // setQuestions([]);
  };

  return (
    <div className="App">
      <Form
        setCategory={setCategory}
        setGradingPoints={setGradingPoints}
        onStartQuiz={onStartQuiz}
        setQuizname={setQuizname}
        quizName={quizName}
        category={category}
        isQuizPlaying={isQuizPlaying}
      />
      {!showResults ? (
        <Quiz
          questions={questions}
          selectedAnswerIndex={selectedAnswerIndex}
          onClickNext={onClickNext}
          onSelectAnswer={onSelectAnswer}
          activeQuestion={activeQuestion}
          showQuiz={showQuiz}
          isLoading={isLoading}
          category={category}
          onEditQuiz={onEditQuiz}
          restartQuiz={restartQuiz}
          showEditForm={showEditForm}
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
      <p>{timer}s</p>
    </div>
  );
}

export default App;
