import React from "react";
import "./Results.css";
import EditForm from "./EditForm";

const Results = ({
  questions,
  results,
  quizName,
  onAttemptAgain,
  onEditQuiz,
  showEditForm,
}) => {
  return (
    <>
      <div className="result">
        <h3>Result for {quizName}</h3>
        <p>
          Total Questions: <span>{questions?.length}</span>
        </p>
        <p>
          Total Score:<span> {results.score}</span>
        </p>
        <p>
          Correct Answers:<span> {results.correctAnswers}</span>
        </p>
        <p>
          Wrong Answers:<span> {results.wrongAnswers}</span>
        </p>
        <div>
          <button onClick={() => onAttemptAgain()}>Attempt Again</button>
          <button onClick={() => onEditQuiz()}>Edit Quiz</button>
        </div>
      </div>
      {showEditForm && <EditForm />}
    </>
  );
};

export default Results;
