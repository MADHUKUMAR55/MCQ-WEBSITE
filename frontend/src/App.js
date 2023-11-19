// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionCard from './components/QuestionCard';

const App = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/topics')
            .then(response => {
                setTopics(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleTopicSelect = (topicName) => {
        const topic = topics.find(topic => topic.name === topicName);
        setSelectedTopic(topic);
        setSelectedAnswers({});
        setScore(null);
        setSubmitted(false);
    };

    const handleOptionSelect = (questionId, option) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: option
        });
    };

    const handleSubmit = () => {
        if (!selectedTopic) return;

        let correctCount = 0;
        selectedTopic.questions.forEach(question => {
            if (selectedAnswers[question.id] === question.correctAnswer) {
                correctCount++;
            }
        });

        setScore(`${correctCount} out of ${selectedTopic.questions.length}`);
        setSubmitted(true);
    };

    return (
        <div className="App">
            <div className="content">
                <div className="topics-list">
                    {topics.map((topic, index) => (
                        <button key={index} className="topic-button" onClick={() => handleTopicSelect(topic.name)}>
                            {topic.name}
                        </button>
                    ))}
                </div>
                <div className="questions-container">
                    {selectedTopic && (
                        <>
                            {selectedTopic.questions.map((question, questionIndex) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    options={question.options}
                                    onSelect={(option) => handleOptionSelect(question.id, option)}
                                    selectedOption={selectedAnswers[question.id]}
                                    correctAnswer={submitted ? question.correctAnswer : null}
                                    questionNumber={questionIndex + 1}
                                />
                            ))}
                            {!submitted && <button onClick={handleSubmit}>Submit Answers</button>}
                            {score && <div className="score-display">Your score: {score}</div>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
