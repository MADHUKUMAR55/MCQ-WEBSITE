import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Add Link to the import
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AnalysisPage from './components/AnalysisPage';
import Chapters from './components/Chapters';


const SubjectList = ({ subjects }) => (
    <div className="subjects-grid">
        {subjects.map((subject, index) => (
            <div className="subject-item" key={index}>
                <Link to={`/subject/${subject.id}`}>
                    <img src={`/images/subjects/${subject.imageName}`} alt={subject.name} className="subject-image" />
                    <div className="subject-name">{subject.name}</div>
                </Link>
            </div>
        ))}
    </div>
);


const App = () => {
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setUserEmail(storedEmail);
        }

        axios.get('http://127.0.0.1:5000/subjects')
            .then(response => {
                setSubjects(response.data);
                setFilteredSubjects(response.data); // Initialize filtered subjects
            })
            .catch(error => console.error('Error fetching subjects:', error));

        axios.get('http://127.0.0.1:5000/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleSearch = (query) => {
        const filtered = subjects.filter(subject => 
            subject.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSubjects(filtered);
    };

    const handleLogin = (email) => {
        setUserEmail(email);
        localStorage.setItem("userEmail", email); // Store email in local storage
    };

    const handleLogout = () => {
        setUserEmail(""); // Clear email from state
        localStorage.removeItem("userEmail"); // Clear email from local storage
    };

    const handleCategorySelect = (categoryId) => {
        axios.get(`http://127.0.0.1:5000/subjects-by-category?categoryId=${categoryId}`)
            .then(response => {
                setFilteredSubjects(response.data);
            })
            .catch(error => console.error('Error fetching subjects by category:', error));
    };

    return (
        <Router>
            <Header onSearch={handleSearch} />
            {userEmail && (
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            )}
            <div className="container">
                {!userEmail ? (
                    <div style={{ padding: "20px" }}>
                        <h2>Please enter your email to continue</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin(e.target.elements.email.value);
                        }}>
                            <input type="email" name="email" placeholder="Enter your email" required />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/" element={
                            <>
                                <Sidebar categories={categories} subjects={subjects} handleCategorySelect={handleCategorySelect} />
                                <main className="main-full">
                                    <SubjectList subjects={filteredSubjects} />
                                </main>
                            </>
                        } />
                        <Route path="/subject/:subjectId" element={<Chapters userEmail={userEmail} />} />
                        <Route path="/analysis" element={<AnalysisPage userEmail={userEmail} />} />
                        {/* Add other routes as needed */}
                    </Routes>
                )}
            </div>
        </Router>
    );
};

export default App;
