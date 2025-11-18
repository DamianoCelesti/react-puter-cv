import { useEffect, useState } from "react";
// Import degli hook per gestire stato ed effetti

import ScoreBadge from "./ScoreBadge";
// Import del componente che mostra il badge del punteggio

import { Link } from "react-router-dom";
// Link permette di rendere la card cliccabile e navigare alla pagina del resume

import { usePuterStore } from "../lib/puter";
// Import dello store da cui si ottiene l'accesso al filesystem (fs)


// Converte un numero qualsiasi in un valore compreso tra 0 e 100
const to100 = (n) => {
    const x = Number(n ?? 0); // Converte in numero, se null/undefined diventa 0
    return Math.max(0, Math.min(100, Math.round(x <= 10 ? x * 10 : x)));
    // Se <=10 lo scala *10, altrimenti arrotonda e limita tra 0–100
};


const ResumeCard = ({ resume }) => {
    const { fs } = usePuterStore();
    // Estrae il filesystem interno per leggere i file

    const [previewUrl, setPreviewUrl] = useState("");
    // Stato per contenere l’URL generato della preview dell'immagine

    useEffect(() => {
        let url; // Variabile utile anche nel cleanup

        const load = async () => {
            try {
                if (!resume?.imagePath) return;
                // Se non esiste un percorso immagine, esce subito

                const blob = await fs.read(resume.imagePath);
                // Legge il file dal filesystem

                if (!blob) return;
                // Se la lettura non restituisce nulla, interrompe

                const typed =
                    blob.type && blob.type.startsWith("image/")
                        ? blob
                        : new Blob([blob], { type: "image/png" });
                // Se il blob non è un'immagine, lo converte in un Blob PNG

                url = URL.createObjectURL(typed);
                // Genera un URL temporaneo utilizzabile come src di un <img>

                setPreviewUrl(url);
                // Salva l'URL nello stato
            } catch (e) {
                console.error("[ResumeCard] errore lettura preview:", e);
                // Log dell’errore in caso di problemi
            }
        };

        load(); // Avvia la lettura dell'immagine quando cambia imagePath o fs

        return () => {
            if (url) URL.revokeObjectURL(url);
            // Cleanup: elimina l’URL temporaneo dalla memoria
        };
    }, [fs, resume?.imagePath]);


    if (!resume) return null;
    // Se manca il resume, non renderizza nulla


    const overall = to100(resume?.feedback?.overallScore);
    // Calcolo del punteggio su scala 0–100


    return (
        <Link to={`/resume/${resume.id}`} className="resume-card-link">
            {/* L’intera card diventa cliccabile */}

            <div className="resume-card">

                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Resume preview"
                        className="resume-card__image"
                        onError={(e) => {
                            // Gestione errori nel caricamento dell’immagine
                            console.error("[ResumeCard] <img> onError, rimuovo anteprima");
                            e.currentTarget.removeAttribute("src");
                            setPreviewUrl("");
                        }}
                    />
                ) : (
                    <div className="resume-card__placeholder">Preview not available</div>
                    // Placeholder nel caso non ci sia una preview immagine
                )}

                <div className="resume-card__info">
                    <h3 className="resume-card__title">
                        {resume.companyName || "Resume"}
                        {/* Nome della compagnia o fallback */}
                    </h3>

                    <p className="resume-card__subtitle">
                        {resume.jobTitle || ""}
                        {/* Job title se presente */}
                    </p>

                    <div className="resume-card__metrics">
                        <ScoreBadge label="Overall" score={overall} />
                        {/* Badge grafico del punteggio */}

                        <span>{overall}/100</span>
                        {/* Rappresentazione numerica del punteggio */}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
