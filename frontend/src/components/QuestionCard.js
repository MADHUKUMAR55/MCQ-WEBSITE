// src/components/QuestionCard.js
import React from 'react';

const QuestionCard = ({ question, options, onSelect, selectedOption, correctAnswer, questionNumber }) => {
    return (
        <div className="question-card">
            <div className="question-text">
                {questionNumber}. {question.text}
            </div>
            <div className="options-container">
                {options.map((option, index) => {
                    let buttonClass = 'option-button';

                    if (correctAnswer) {
                        if (option === correctAnswer) {
                            buttonClass += ' correct'; // Correct answer
                        } else if (option === selectedOption) {
                            buttonClass += ' incorrect'; // Incorrectly selected option
                        }
                    } else if (option === selectedOption) {
                        buttonClass += ' selected'; // Selected option, only if not submitted
                    }

                    return (
                        <button
                            key={index}
                            className={buttonClass}
                            onClick={() => onSelect(option)}
                            disabled={!!correctAnswer} // Disable buttons after submission
                        >
                            {String.fromCharCode(97 + index)}. {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionCard;
