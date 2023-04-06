import React, { useRef, useState } from "react";
import "./EditForm.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const EditForm = ({ questions, category }) => {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

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

    console.log(questions);
    // console.log(question, choices, correctAnswer);
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
        />
      </label>
      <label>
        <span>Choices:</span>
        <input
          onChange={(e) => setNewChoice(e.target.value)}
          value={newChoice}
          ref={choiceRef}
        />
        <span>
          <button onClick={addChoice}>Add Choice</button>
        </span>
      </label>
      <p>
        Your choices:
        {choices.map((c) => (
          <em key={c}> {c}, </em>
        ))}
      </p>
      <label>
        <span>Correct Answer:</span>
        <input
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
      </label>

      <button>Submit</button>
    </form>
  );
};

export default EditForm;
