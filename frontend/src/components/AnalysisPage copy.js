import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const AnalysisPage = ({ userEmail }) => {
    const [chartData, setChartData] = useState({
        subjectPerformance: [],
        chapterPerformance: [],
        subtopicPerformance: [],
        difficultyPerformance: [],
        typePerformance: []
    });
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/user-analysis?email=${userEmail}`)
            .then(response => {
                setChartData(response.data);
            })
            .catch(error => console.error('Error fetching analysis data:', error));

        axios.get(`http://127.0.0.1:5000/subjects`)
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => console.error('Error fetching subjects:', error));
    }, [userEmail]);

    const handleSubjectClick = (data) => {
        const subjectName = data.name;
        const subject = subjects.find(s => s.name === subjectName);
        if (subject) {
            setSelectedSubjectId(subject.id);
        } else {
            console.error('Subject not found:', subjectName);
        }
    };

    const getFilteredData = (dataKey) => {
        return selectedSubjectId !== null
            ? chartData[dataKey].filter(item => item.subjectId === selectedSubjectId)
            : chartData[dataKey];
    };

    const renderBarChart = (data, dataKey, chartTitle, isStacked = false) => (
        <div>
            <h3>{chartTitle}</h3>
            <BarChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={dataKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="correct" fill="#82ca9d" name="Correct" stackId={isStacked ? 'a' : undefined} />
                <Bar dataKey="incorrect" fill="#ff4d4d" name="Incorrect" stackId={isStacked ? 'a' : undefined} />
            </BarChart>
        </div>
    );

    const renderPieChart = (data, chartTitle) => {
        const colors = ['#82ca9d', '#ff4d4d'];
        return (
            <div>
                <h3>{chartTitle}</h3>
                <PieChart width={400} height={400}>
                    <Pie dataKey="value" isAnimationActive={false} data={data} outerRadius={80} fill="#8884d8" label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
        );
    };

    return (
        <div>
            <h2>User Performance Analysis</h2>
            <div>
                <h3>Performance by Subject</h3>
                <BarChart width={600} height={300} data={chartData.subjectPerformance} onClick={(e) => handleSubjectClick(e.activePayload[0].payload)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="correct" fill="#82ca9d" name="Correct" />
                    <Bar dataKey="incorrect" fill="#ff4d4d" name="Incorrect" />
                </BarChart>
            </div>
            {selectedSubjectId !== null ? (
                <>
                    {renderBarChart(getFilteredData('chapterPerformance'), "name", "Performance by Chapter", true)}
                    {renderBarChart(getFilteredData('subtopicPerformance'), "name", "Performance by Subtopic")}
                    {renderBarChart(getFilteredData('difficultyPerformance'), "name", "Performance by Difficulty", true)}
                    {getFilteredData('typePerformance').map((typeData, index) =>
                        renderPieChart(
                            [{"name": "Correct", "value": typeData.correct}, {"name": "Incorrect", "value": typeData.incorrect}],
                            `Performance by Type - ${typeData.name}`
                        )
                    )}
                </>
            ) : (
                <>
                    {renderBarChart(chartData.chapterPerformance, "name", "Performance by Chapter", true)}
                    {renderBarChart(chartData.subtopicPerformance, "name", "Performance by Subtopic")}
                    {renderBarChart(chartData.difficultyPerformance, "name", "Performance by Difficulty", true)}
                    {chartData.typePerformance.map((typeData, index) =>
                        renderPieChart(
                            [{"name": "Correct", "value": typeData.correct}, {"name": "Incorrect", "value": typeData.incorrect}],
                            `Performance by Type - ${typeData.name}`
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default AnalysisPage;
