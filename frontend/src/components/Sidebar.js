import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = ({ categories, subjects, handleCategorySelect }) => {
    const location = useLocation();
    const isMainPage = location.pathname === '/';

    const renderSidebarContent = () => {
        if (isMainPage) {
            // Render categories on the main page
            return categories.map(category => (
                <button key={category.id} onClick={() => handleCategorySelect(category.id)}>
                    {category.name}
                </button>
            ));
        } else {
            // Extract subjectId from URL and render topics for that subject
            const subjectId = location.pathname.split('/')[2]; // Assumes URL is /subject/:subjectId
            const selectedSubject = subjects.find(subject => subject.id === parseInt(subjectId));
            if (selectedSubject && selectedSubject.topics) {
                return selectedSubject.topics.map(topic => (
                    <Link key={topic.id} to={`/topic/${topic.id}`}>
                        {topic.name}
                    </Link>
                ));
            }
        }
    };

    return (
        <aside className="category-sidebar">
            {renderSidebarContent()}
        </aside>
    );
};

export default Sidebar;
