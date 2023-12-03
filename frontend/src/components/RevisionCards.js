import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RevisionCards = () => {
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/polity-content')
            .then(response => {
                setCards(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching polity content:', error);
                setIsLoading(false);
            });
    }, []);

    const handleNextClick = () => {
        setCurrentCardIndex(prevIndex => 
            prevIndex + 1 < cards.length ? prevIndex + 1 : 0
        );
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!cards[currentCardIndex]) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <div className="card">
                <h3>{cards[currentCardIndex].title}</h3>
                <p>{cards[currentCardIndex].content}</p>
            </div>
            <button className="card-button" onClick={handleNextClick}>Next</button>
        </div>
    );
};
export default RevisionCards;
