import React from 'react';
import Avatar from './Avatar';

const ResultScreen = ({ data, onRestart }) => {
    const { score, total, passed, error } = data;
    const isWin = passed;

    return (
        <div className="container text-center">
            <h1>{isWin ? 'MISSION ACCOMPLISHED' : 'GAME OVER'}</h1>

            <Avatar seed={isWin ? 'winner' : 'loser'} size={150} />

            <div style={{ margin: '20px 0', padding: '10px', border: '2px dashed #fff' }}>
                <h2>SCORE: {score} / {total}</h2>
                {error && <p className="error">{error}</p>}
                {passed ? <p style={{ color: 'var(--pixel-success)' }}>YOU PASSED!</p> : <p style={{ color: 'var(--pixel-error)' }}>TRY AGAIN!</p>}
            </div>

            <button className="btn" onClick={onRestart}>PLAY AGAIN</button>
        </div>
    );
};

export default ResultScreen;
