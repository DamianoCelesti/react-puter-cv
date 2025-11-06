import React, { useEffect, useState } from "react";
import ScoreBadge from "./ScoreBadge";
import { Link } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const to100 = (n) => {
    const x = Number(n ?? 0);
    return Math.max(0, Math.min(100, Math.round(x <= 10 ? x * 10 : x)));
};

const ResumeCard = ({ resume }) => {
    const { fs } = usePuterStore();
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        let url;
        const load = async () => {
            try {
                if (!resume?.imagePath) return;
                const blob = await fs.read(resume.imagePath);
                if (!blob) return;

                const typed =
                    blob.type && blob.type.startsWith("image/")
                        ? blob
                        : new Blob([blob], { type: "image/png" });

                url = URL.createObjectURL(typed);
                setPreviewUrl(url);
            } catch (e) {
                console.error("[ResumeCard] errore lettura preview:", e);
            }
        };
        load();
        return () => { if (url) URL.revokeObjectURL(url); };
    }, [fs, resume?.imagePath]);

    if (!resume) return null;

    const overall = to100(resume?.feedback?.overallScore);

    return (
        <Link to={`/resume/${resume.id}`} className="resume-card-link">
            <div className="resume-card">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Resume preview"
                        className="resume-card__image"
                        onError={(e) => {
                            console.error("[ResumeCard] <img> onError, rimuovo anteprima");
                            e.currentTarget.removeAttribute("src");
                            setPreviewUrl("");
                        }}
                    />
                ) : (
                    <div className="resume-card__placeholder">Preview not available</div>
                )}

                <div className="resume-card__info">
                    <h3 className="resume-card__title">{resume.companyName || "Resume"}</h3>
                    <p className="resume-card__subtitle">{resume.jobTitle || ""}</p>
                    <div className="resume-card__metrics">
                        <ScoreBadge label="Overall" score={overall} />
                        <span>{overall}/100</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
