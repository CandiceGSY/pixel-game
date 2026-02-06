import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import { fetchQuestions, submitScore } from '../services/api';

const GameScreen = ({ userId, onFinish }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]); // [{ questionId, answer }]
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const data = await fetchQuestions();
                if (data && data.length > 0) {
                    setQuestions(data);
                } else {
                    setError('No questions found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };
        loadQuestions();
    }, []);

    const handleAnswer = (choice) => {
        const currentQ = questions[currentQuestionIndex];

        const newAnswers = [...answers, {
            questionId: currentQ.id,
            answer: choice
        }];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Game Over
            handleFinish(newAnswers);
        }
    };

    const handleFinish = async (finalAnswers) => {
        setLoading(true);

        try {
            // Submit answers to backend for grading
            const result = await submitScore(userId, finalAnswers);

            onFinish({
                score: result.score,
                total: result.total,
                passed: result.passed,
                message: result.message
            });
        } catch (err) {
            console.error(err);
            onFinish({
                score: '?',
                total: finalAnswers.length,
                passed: false,
                error: "Failed to submit score. Please check connection."
            });
        }
    };

    if (loading) return <div className="container loading">LOADING...</div>;
    if (error) return <div className="container error">{error}</div>;
    if (questions.length === 0) return <div className="container">No Questions.</div>;

    const currentQ = questions[currentQuestionIndex];
    const avatarSeed = `boss-${currentQuestionIndex}`;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>PLAYER: {userId}</span>
                <span>STAGE {currentQuestionIndex + 1}/{questions.length}</span>
            </div>

            <Avatar seed={avatarSeed} size={120} />

            <h3 style={{ margin: '20px 0', minHeight: '60px' }}>{currentQ.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['A', 'B', 'C', 'D'].map((optionKey) => (
                    <button
                        key={optionKey}
                        className="btn btn-secondary"
                        onClick={() => handleAnswer(optionKey)}
                        style={{ textAlign: 'left' }}
                    >
                        {optionKey}: {currentQ[optionKey]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameScreen;
