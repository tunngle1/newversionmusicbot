import React from 'react';

interface CircularProgressProps {
    progress: number; // 0-100
    size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress, size = 36 }) => {
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-700/50"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-blue-400 transition-all duration-300 ease-out"
                    strokeLinecap="round"
                />
            </svg>
            {/* Progress text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-blue-400">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};

export default CircularProgress;
