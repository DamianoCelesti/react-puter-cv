import { useEffect, useState } from "react";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "../lib/puter";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  // Stato per la lista dei CV
  const [resumes, setResumes] = useState([]);
  // Stato per indicare il caricamento dei CV
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    // Se non autenticato, redirect alla pagina di login con next=/ per tornare qui dopo
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true); // attiva spinner/caricamento
      try {
        // Legge tutte le chiavi kv che matchano "resume:*"
        const entries = await kv.list("resume:*", true);

        const parsed = (entries || [])
          .map((r) => {
            try {
              const obj = JSON.parse(r.value); // parsing JSON del valore
              // Pulizia di flag temporanei che non devono essere esposti
              if (obj?.__broken) delete obj.__broken;
              return obj;
            } catch {
              // In caso di JSON non valido ritorna null (viene poi filtrato)
              return null;
            }
          })
          .filter(Boolean); // rimuove eventuali null

        setResumes(parsed); // aggiorna lo stato con i resume validi
      } finally {
        setLoadingResumes(false); // disattiva spinner anche in caso di errore
      }
    };

    loadResumes();
  }, [kv]); // riesegue quando cambia l'istanza kv

  return (
    <main className="home">
      <section className="main-section">
        <div className="page-heading home-heading">
          <h1>Tieni traccia dei tuoi cv e il loro rating</h1>

          {/* Messaggio diverso a seconda se ci sono CV o no */}
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>Nessun cv trovato. Upload il tuo primo cv per un feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {/* Pulsante per creare una nuova review / upload */}
        <div className="new-review-btn-box">
          <Link to="/upload" className="primary-button">
            Nuova review
          </Link>
        </div>

        {/* Visualizzazione loading */}
        {loadingResumes && (
          <div className="loading-box">
            <img src="/images/resume-scan-2.gif" alt="loading" />
          </div>
        )}

        {/* Lista dei resume quando caricati */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Invito all'upload se non ci sono resume */}
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
