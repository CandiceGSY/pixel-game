import React, { useMemo } from 'react';

const Avatar = ({ seed, size = 150 }) => {
    const avatarUrl = useMemo(() => {
        // dicebear pixel-art style
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
    }, [seed]);

    return (
        <div className="avatar-container" style={{ margin: '10px auto', textAlign: 'center' }}>
            <img
                src={avatarUrl}
                alt={`Avatar for ${seed}`}
                width={size}
                height={size}
                style={{ imageRendering: 'pixelated', border: '4px solid white', background: '#444' }}
            />
        </div>
    );
};

export default Avatar;
