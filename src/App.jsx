import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import './styles/index.css';

function App() {
    const [gameState, setGameState] = useState('welcome'); // welcome, playing, result
    const [userId, setUserId] = useState('');
    const [scoreData, setScoreData] = useState(null);

    const startGame = (id) => {
        setUserId(id);
        setGameState('playing');
    };

    const finishGame = (data) => {
        setScoreData(data);
        setGameState('result');
    };

    const resetGame = () => {
        setGameState('welcome');
        setUserId('');
        setScoreData(null);
    };

    return (
        <>
            {gameState === 'welcome' && <WelcomeScreen onStart={startGame} />}
            {gameState === 'playing' && <GameScreen userId={userId} onFinish={finishGame} />}
            {gameState === 'result' && <ResultScreen data={scoreData} onRestart={resetGame} />}
        </>
    );
}

export default App;
