import { useState } from "react";
import "./Quiz.css";
import TrashIcon from "../assets/trashcan-icon.svg";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function Quiz({
  selectedAnswerIndex,
  onClickNext,
  onSelectAnswer,
  questions,
  activeQuestion,
  showQuiz,
}) {
  const [showWarning, setShowWarning] = useState(false);

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  const questionId = questions && questions[activeQuestion]?.id;

  const deleteQuestion = async (id) => {
    const ref = doc(db, "questions", id);
    await deleteDoc(ref);
    setShowWarning(false);
  };

  const openWarning = () => {
    setShowWarning(true);
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  return (
    <>
      <div className="quiz">
        {showQuiz ? (
          <>
            {questions && (
              <h2 className="quiz-heading">
                {questions[activeQuestion]?.category?.toUpperCase()}
              </h2>
            )}
            <div className="quiz-question_number">
              <span className="active-question-no">
                {addLeadingZero(activeQuestion + 1)}
              </span>
              <span className="total-question">
                /{addLeadingZero(questions?.length)}
              </span>
            </div>
            {questions && (
              <p className="quiz-text">
                <span>Question:</span> {questions[activeQuestion]?.question}
              </p>
            )}
            <ul>
              {questions &&
                questions[activeQuestion]?.choices?.map((choice, index) => (
                  <li
                    key={choice}
                    onClick={() => onSelectAnswer(choice, index)}
                    className={
                      selectedAnswerIndex === index ? "selected-answer" : null
                    }
                  >
                    {choice}
                  </li>
                ))}
            </ul>

            <div className="flex-right">
              <img
                src={TrashIcon}
                alt="delete question icon"
                onClick={openWarning}
              />
              <button
                onClick={onClickNext}
                disabled={selectedAnswerIndex === null}
              >
                {activeQuestion === questions?.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </>
        ) : (
          <p>Fill form to start</p>
        )}
        {showWarning && (
          <div className="warning">
            <div className="warning-content">
              <p>Are you sure you want to Permenently delete this question?</p>
              <div>
                <button onClick={() => deleteQuestion(questionId)}>YES</button>
                <button onClick={closeWarning}>NO</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Quiz;
