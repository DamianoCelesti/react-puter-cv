const ScoreCircle = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="score-circle">
            <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop
                            offset="0%"
                            stopColor={score > 69 ? "#4ade80" : score > 39 ? "#facc15" : "#f87171"}
                        />
                        <stop
                            offset="100%"
                            stopColor={score > 69 ? "#22c55e" : score > 39 ? "#eab308" : "#ef4444"}
                        />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="none"
                />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className="score-text">
                <p className="text-xl font-semibold">{score}</p>
                <p className="text-sm text-gray-500">Score</p>
            </div>
        </div>
    );
};

export default ScoreCircle;
