import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";
// Importo i componenti che mostrano punteggi in modi diversi


// Converte un punteggio grezzo in una scala 0–100
const to100 = (n) => {
    const x = Number(n ?? 0);               // Converto in numero, fallback a 0
    const scaled = x <= 10 ? x * 10 : x;    // Se è da 0 a 10 → normalizzo (x*10)
    return Math.max(0, Math.min(100, Math.round(scaled)));
    // Ritorno un valore sempre tra 0 e 100
};


// Componente che rappresenta una singola categoria di punteggio
const Category = ({ title, score }) => {
    const s = to100(score);   // Converto il punteggio in scala 0–100

    // Scelgo il colore del testo in base al valore
    const textColor =
        s > 70
            ? "text-green-600"
            : s > 49
                ? "text-yellow-600"
                : "text-red-600";

    return (
        <div className="resume-summary">
            <div className="category">

                {/* Titolo e piccolo badge con punteggio */}
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={s} />    {/* Badge del punteggio */}
                </div>

                {/* Punteggio formattato grande con colore dinamico */}
                <p className="text-2xl">
                    <span className={textColor}>{s}/100</span>
                </p>
            </div>
        </div>
    );
};


// Componente principale che mostra il riepilogo generale + tutte le categorie
const Summary = ({ score, feedback }) => {
    // Calcolo il punteggio complessivo (priorità: prop → feedback → 0)
    const overall = to100(score ?? feedback?.overallScore ?? 0);

    return (
        <div className="resume-summary">
            <div className="category">

                {/* Gauge principale del punteggio complessivo */}
                <div className="flex flex-row gap-2 items-center justify-center">
                    <ScoreGauge score={overall} />
                </div>

                {/* Testo descrittivo */}
                <div>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            {/* Le varie categorie, ognuna con il proprio punteggio */}
            <Category title="Tone & Style" score={feedback?.toneAndStyle?.score ?? 0} />
            <Category title="Content" score={feedback?.content?.score ?? 0} />
            <Category title="Structure" score={feedback?.structure?.score ?? 0} />
            <Category title="Skills" score={feedback?.skills?.score ?? 0} />
        </div>
    );
};

export default Summary;
