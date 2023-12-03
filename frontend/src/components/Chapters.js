import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QuestionCard from './QuestionCard';

const ChapterList = ({ chapters, onSelectChapter }) => (
    <div className="chapters-list">
        {chapters.map((chapter, index) => (
            <button key={index} className="chapter-button" onClick={() => onSelectChapter(chapter.name)}>
                {chapter.name}
            </button>
        ))}
    </div>
);

const Chapters = ({ userEmail }) => {
    const { subjectId } = useParams();
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/chapters?subjectId=${subjectId}`)
            .then(response => {
                setChapters(response.data);
            })
            .catch(error => {
                console.error('Error fetching chapters:', error);
            });
    }, [subjectId]);

    const handleChapterSelect = (chapterName) => {
        const chapter = chapters.find(ch => ch.name === chapterName);
        setSelectedChapter(chapter);
        setNumberOfQuestions(null);
        setSelectedAnswers({});
        setScore(null);
        setSubmitted(false);
    };

    const handleQuestionsCountSelect = (count) => {
        if (selectedChapter) {
            const shuffledQuestions = shuffleArray(selectedChapter.questions);
            const selectedQuestions = count === 'All' ? shuffledQuestions : shuffledQuestions.slice(0, count);
            setSelectedChapter({ ...selectedChapter, questions: selectedQuestions });
        }
        setNumberOfQuestions(count);
    };

    const handleOptionSelect = (questionId, option) => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: option
        }));
    };

    const areAllQuestionsAnswered = () => {
        return selectedChapter && selectedChapter.questions.length === Object.keys(selectedAnswers).length;
    };

    const handleSubmit = () => {
        if (!selectedChapter) return;

        if (!areAllQuestionsAnswered()) {
            alert("Please select options for all questions before submitting.");
            return;
        }

        let correctQuestions = [];
        let incorrectQuestions = [];
        selectedChapter.questions.forEach(question => {
            if (selectedAnswers[question.id] === question.correctAnswer) {
                correctQuestions.push(question.id);
            } else {
                incorrectQuestions.push(question.id);
            }
        });

        const submissionDetails = {
            email: userEmail,
            score: `${correctQuestions.length} out of ${selectedChapter.questions.length}`,
            subjectId: selectedChapter.subjectId,
            chapterName: selectedChapter.name,
            correctQuestions,
            incorrectQuestions
        };

        axios.post('http://127.0.0.1:5000/submit-score', submissionDetails)
            .then(response => {
                console.log('Score submitted:', response.data);
            })
            .catch(error => {
                console.error('Error submitting score:', error);
            });

        setScore(submissionDetails.score);
        setSubmitted(true);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <div className="App">
            <div className="content">
                <ChapterList chapters={chapters} onSelectChapter={handleChapterSelect} />
                <div className="questions-container">
                    {selectedChapter && !numberOfQuestions && (
                        <div className="question-count-container"> {/* Add this class */}
                            <button onClick={() => handleQuestionsCountSelect(3)}>Set of 3 Questions</button>
                            <button onClick={() => handleQuestionsCountSelect(10)}>Set of 10 Questions</button>
                            <button onClick={() => handleQuestionsCountSelect(25)}>Set of 25 Questions</button>
                            <button onClick={() => handleQuestionsCountSelect('All')}>All Questions</button>
                        </div>
                    )}
                    {selectedChapter && numberOfQuestions && (
                        <>
                            {selectedChapter.questions.map((question, questionIndex) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    options={question.options}
                                    onSelect={(option) => handleOptionSelect(question.id, option)}
                                    selectedOption={selectedAnswers[question.id]}
                                    correctAnswer={submitted ? question.correctAnswer : null}
                                    explanation={submitted ? question.explanation : ""}
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

export default Chapters;
