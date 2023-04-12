import React from "react";
import "./Form.css";

function Form({
  setCategory,
  onStartQuiz,
  setGradingPoints,
  setQuizname,
  quizName,
  category,
  isQuizPlaying,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onStartQuiz();
  };

  return (
    <div className="quiz-form_container">
      <h1>Quiz App</h1>
      <form className="quiz-form" onSubmit={handleSubmit}>
        <label>
          Quiz Name:
          <input
            type="text"
            placeholder="Enter quiz name"
            value={quizName}
            onChange={(e) => setQuizname(e.target.value)}
            required
          />
        </label>
        <label>
          Category:
          <select
            className="select"
            onChange={(e) => setCategory(e.target.value)}
            value={category ? category : ""}
          >
            <option
              className="description-options"
              value=""
              disabled
              defaultValue
            >
              Select Category
            </option>
            <option value="react" className="description-options">
              React
            </option>
            <option value="html" className="description-options">
              HTML
            </option>
            <option value="javascript" className="description-options">
              JavaScript
            </option>
            <option value="css" className="description-options">
              CSS
            </option>
          </select>
        </label>
        <label>
          Grading points:
          <select
            className="select"
            onChange={(e) => setGradingPoints(e.target.value)}
            // value={gra}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>

        <button type="submit" className="start-button" disabled={isQuizPlaying}>
          start quiz
        </button>
      </form>
    </div>
  );
}

export default Form;
