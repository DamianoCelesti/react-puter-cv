
import ScoreBadge from "./ScoreBadge";
import { Link } from "react-router-dom";


const to100 = (n) => {
    const x = Number(n ?? 0);
    return Math.max(0, Math.min(100, Math.round(x <= 10 ? x * 10 : x)));
};

const ResumeCard = ({ resume }) => {
    if (!resume) return null;


    const overall = to100(resume?.feedback?.overallScore);

    return (
        <Link to={`/resume/${resume.id}`} className="resume-card-link">
            <div className="resume-card">
                <img src={resume.imagePath} alt="Resume preview" />
                <div>
                    <h3>{resume.companyName}</h3>
                    <p>{resume.jobTitle}</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <ScoreBadge label="Overall" score={overall} />
                        <span>{overall}/100</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
