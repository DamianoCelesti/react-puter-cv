import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";


const to100 = (n) => {
    const x = Number(n ?? 0);
    const scaled = x <= 10 ? x * 10 : x;
    return Math.max(0, Math.min(100, Math.round(scaled)));
};

const Category = ({ title, score }) => {
    const s = to100(score);
    const textColor = s > 70 ? "text-green-600" : s > 49 ? "text-yellow-600" : "text-red-600";

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={s} />
                </div>
                <p className="text-2xl">
                    <span className={textColor}>{s}/100</span>
                </p>
            </div>
        </div>
    );
};

const Summary = ({ score, feedback }) => {
    const overall = to100(score ?? feedback?.overallScore ?? 0);

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <ScoreGauge score={overall} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback?.toneAndStyle?.score ?? 0} />
            <Category title="Content" score={feedback?.content?.score ?? 0} />
            <Category title="Structure" score={feedback?.structure?.score ?? 0} />
            <Category title="Skills" score={feedback?.skills?.score ?? 0} />
        </div>
    );
};

export default Summary;
