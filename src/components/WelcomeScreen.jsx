import React, { useState } from 'react';

const WelcomeScreen = ({ onStart }) => {
    const [id, setId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id.trim()) {
            setError('Please enter an ID');
            return;
        }
        onStart(id.trim());
    };

    return (
        <div className="container text-center">
            <h1>PIXEL QUIZ RUN</h1>
            <p>Enter your ID to start the challenge!</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="userId">PLAYER ID</label>
                    <input
                        type="text"
                        id="userId"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="INSERT COIN (ID)"
                        autoComplete="off"
                        autoFocus
                    />
                </div>
                {error && <p className="error mb-2">{error}</p>}

                <button type="submit" className="btn">START GAME</button>
            </form>

            <div className="mt-2">
                <small style={{ color: '#888' }}>PRESS START</small>
            </div>
        </div>
    );
};

export default WelcomeScreen;
