import { useEffect, useRef, useState } from "react";
// Import degli hook React:
// useEffect → esegue codice dopo il render
// useRef → tiene un riferimento a un elemento DOM (il path dell'arco)
// useState → gestisce lo stato locale


const ScoreGauge = ({ score = 75 }) => {
    // Tiene la lunghezza totale dell'arco SVG
    const [pathLength, setPathLength] = useState(0);

    // Ref per accedere al path dell'arco in primo piano
    const pathRef = useRef(null);

    // Converte il punteggio in percentuale 0–1
    const percentage = score / 100;

    useEffect(() => {
        // Quando il componente è montato, se il path esiste,
        // ricava automaticamente la sua lunghezza in pixel
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);
    // Array vuoto → eseguito solo una volta al mount


    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">

                    {/* Definizione del gradiente per colorare l'arco */}
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#a78bfa" />   {/* Viola */}
                            <stop offset="100%" stopColor="#fca5a5" /> {/* Rosa */}
                        </linearGradient>
                    </defs>

                    {/* Arco di sfondo (grigio), sempre al 100% */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Arco colorato in primo piano */}
                    <path
                        ref={pathRef}  // Permette di calcolare la sua lunghezza
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"  // Applica il gradiente
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}     // Lunghezza totale dell'arco
                        strokeDashoffset={pathLength * (1 - percentage)}
                    // Il trucco:
                    // più alto è il punteggio → più l'arco rimane visibile
                    />
                </svg>

                {/* Testo centrato sopra l'arco */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="text-xl font-semibold pt-4">
                        {score}/100
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
