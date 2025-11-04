import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePuterStore } from "../lib/puter";
import Summary from "../components/Summary";
import ATS from "../components/ATS";
import Details from "../components/Details";

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

    useEffect(() => {
        let imgUrl, pdfUrl;

        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            pdfUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(pdfUrl);

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            imgUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imgUrl);

            setFeedback(data.feedback);
        };

        loadResume();
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            if (imgUrl) URL.revokeObjectURL(imgUrl);
        };
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>

            <div className="resume-page-vertical">

                {/* Colonna immagine */}
                <section
                    className="feedback-section"
                    style={{ backgroundImage: "url('/images/bg-small.svg')", backgroundSize: "cover" }}
                >
                    {imageUrl && resumeUrl && (
                        <div className="gradient-border resume-preview-wrapper animate-in fade-in">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="resume-preview-img"
                                    title="resume"
                                    alt="Resume preview"
                                />
                            </a>
                        </div>
                    )}
                </section>

                {/* Colonna feedback */}
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold text-center">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000 w-full max-w-xl">
                            <Summary score={feedback.overallScore} feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full max-w-md" />
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;
