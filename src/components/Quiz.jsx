import "./Quiz.css";

function Quiz({
  selectedAnswerIndex,
  onClickNext,
  onSelectAnswer,
  questions,
  activeQuestion,
  showQuiz,
}) {
  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  return (
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
    </div>
  );
}

export default Quiz;
