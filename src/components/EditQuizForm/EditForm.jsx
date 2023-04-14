import React, { useRef, useState } from "react";
import "./EditForm.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const EditForm = ({ setShowEditForm, setShowResults }) => {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [category, setCategory] = useState("");

  const choiceRef = useRef(null);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const ref = collection(db, "questions");
    await addDoc(ref, {
      question,
      choices,
      correctAnswer,
      category,
    });

    setQuestion("");
    setChoices([]);
    setNewChoice("");
    setCorrectAnswer("");
    setCategory("");
    setShowEditForm(true);
  };
  const handleSaveForm = () => {
    setShowEditForm(false);
    setShowResults(false);
    window.location.reload();
  };

  const addChoice = (e) => {
    e.preventDefault();
    const choice = newChoice.trim();
    if (choice && !choices.includes(choice)) {
      setChoices((prevChoices) => [...prevChoices, choice]);
    }
    setNewChoice("");
    choiceRef.current.focus();
  };

  return (
    <form className="form" onSubmit={handleAddQuestion}>
      <label>
        <span>Question:</span>
        <textarea
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </label>
      <label>
        <span>Choices:</span>
        <div className="choices-container">
          <input
            onChange={(e) => setNewChoice(e.target.value)}
            value={newChoice}
            ref={choiceRef}
          />
          <span>
            <button onClick={addChoice} className="add-btn">
              Add Choice
            </button>
          </span>
        </div>
      </label>
      <p className="choices">
        {choices.map((c) => (
          <em key={c}>{c}. </em>
        ))}
      </p>
      <div className="category_answer">
        <label className="category">
          <span>Category:</span>
          <select
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled defaultValue>
              Choose Category
            </option>
            <option value="react">React</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
          </select>
        </label>
        <label className="answer">
          <span>Answer:</span>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            {choices &&
              choices?.map((choice) => (
                <option value={choice} key={choice}>
                  {choice}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="edit-btns">
        <button
          className="submit-btn"
          // onClick={handleAddQuestion}
        >
          Add Question
        </button>
        <button type="submit" className="submit-btn" onClick={handleSaveForm}>
          Save and Continue
        </button>
      </div>
    </form>
  );
};

export default EditForm;
