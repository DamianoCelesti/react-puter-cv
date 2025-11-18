const ScoreCircle = ({ score }) => {
    // Calcola la circonferenza del cerchio (r = 45)
    const circumference = 2 * Math.PI * 45;

    // Calcola l'offset in base al punteggio (per mostrare la parte "riempita")
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="score-circle">
            <svg width="100" height="100" viewBox="0 0 100 100">

                {/* Definizione del gradiente usato per colorare l'anello */}
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        {/* Colore iniziale del gradiente, cambia in base al punteggio */}
                        <stop
                            offset="0%"
                            stopColor={
                                score > 69
                                    ? "#4ade80"  // verde
                                    : score > 39
                                        ? "#facc15"  // giallo
                                        : "#f87171"  // rosso
                            }
                        />

                        {/* Colore finale del gradiente, più scuro */}
                        <stop
                            offset="100%"
                            stopColor={
                                score > 69
                                    ? "#22c55e"  // verde scuro
                                    : score > 39
                                        ? "#eab308"  // giallo scuro
                                        : "#ef4444"  // rosso scuro
                            }
                        />
                    </linearGradient>
                </defs>

                {/* Cerchio di sfondo (grigio), rappresenta il "pieno" totale */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"      // colore grigio chiaro
                    strokeWidth="10"
                    fill="none"
                />

                {/* Cerchio colorato che mostra il punteggio */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#grad)"   // usa il gradiente definito sopra
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}  // lunghezza totale del cerchio
                    strokeDashoffset={offset}        // parte scoperta = punteggio
                    strokeLinecap="round"            // estremità arrotondate
                    transform="rotate(-90 50 50)"    // inizia il disegno dall'alto
                />
            </svg>

            {/* Testo dentro il cerchio */}
            <div className="score-text">
                <p className="text-xl font-semibold">{score}</p>   {/* Valore numerico */}
                <p className="text-sm text-gray-500">Score</p>     {/* Etichetta */}
            </div>
        </div>
    );
};

export default ScoreCircle;
