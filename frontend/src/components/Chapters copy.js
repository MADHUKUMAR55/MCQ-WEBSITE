import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QuestionCard from './QuestionCard';

// ChapterList Component
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
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/chapters?subjectId=${subjectId}`)
            .then(response => {
                const chaptersWithShuffledOptions = response.data.map(chapter => ({
                    ...chapter,
                    questions: chapter.questions.map(question => ({
                        ...question,
                        options: shuffleArray([...question.options])
                    }))
                }));
                setChapters(chaptersWithShuffledOptions);
            })
            .catch(error => {
                console.error('Error fetching chapters:', error);
            });
    }, [subjectId]);

    const handleChapterSelect = (chapterName) => {
        const chapter = chapters.find(ch => ch.name === chapterName);
        setSelectedChapter(chapter);
        setSelectedAnswers({});
        setScore(null);
        setSubmitted(false);
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
        let shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    return (
        <div className="App">
            <div className="content">
                <ChapterList chapters={chapters} onSelectChapter={handleChapterSelect} />
                <div className="questions-container">
                    {selectedChapter && (
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
