import React, { useEffect, useState } from "react";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "../lib/puter";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = await kv.list("resume:*", true);
      const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value));
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main className="home">

      <section className="main-section">
        <div className="page-heading home-heading">
          <h1>Tieni traccia dei tuoi cv e il loro rating</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>Nessun cv trovato. Upload il tuo primo cv per un feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="loading-box">
            <img src="/images/resume-scan-2.gif" alt="loading" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="upload-box">
            <Link to="/upload" className="primary-button upload-btn">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
