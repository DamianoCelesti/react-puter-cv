import React from "react";
import ScoreBadge from "./ScoreBadge";

const ResumeCard = ({ resume, onClick }) => {
    if (!resume) return null;

    return (
        <div onClick={() => onClick(resume)}>
            <img src={resume.imagePath} alt="Resume preview" />
            <div>
                <h3>{resume.companyName}</h3>
                <p>{resume.jobTitle}</p>
                <div>
                    <ScoreBadge label="Overall" score={resume.feedback.overallScore} />
                </div>
            </div>
        </div>
    );
};

export default ResumeCard;
