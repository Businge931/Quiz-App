import { useState } from "react";
import "./Quiz.css";
import TrashIcon from "../assets/trashcan-icon.svg";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import EditForm from "./EditQuizForm/EditForm";

function Quiz({
  selectedAnswerIndex,
  onClickNext,
  onSelectAnswer,
  questions,
  activeQuestion,
  showQuiz,
  isLoading,
  category,
  onEditQuiz,
  showEditForm,
  restartQuiz,
}) {
  const [showWarning, setShowWarning] = useState(false);

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  const questionId = questions && questions[activeQuestion]?.id;

  const deleteQuestion = async (id) => {
    const ref = doc(db, "questions", id);
    await deleteDoc(ref);
    setShowWarning(false);
  };

  const handleWarning = () => {
    setShowWarning(!showWarning);
  };

  if (questions?.length === 0) {
    return (
      <div className="">
        <p className="no-questions">{`No questions to load for ${category}`}</p>
        {!showEditForm && (
          <button onClick={() => onEditQuiz()} className="add-btn">
            Add Questions
          </button>
        )}
        {showEditForm && <EditForm />}
      </div>
    );
  }

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
                onClick={handleWarning}
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
          <p>
            {!isLoading
              ? "Welcome!  To attempt Quiz, fill the above form"
              : "Loading..."}
          </p>
        )}
        {showWarning && (
          <div className="warning">
            <div className="warning-content">
              <p>Are you sure you want to Permenently delete this question?</p>
              <div>
                <button onClick={() => deleteQuestion(questionId)}>YES</button>
                <button onClick={handleWarning}>NO</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showQuiz && (
        <button onClick={restartQuiz} className="restart-button">
          Restart Quiz
        </button>
      )}
    </>
  );
}

export default Quiz;
