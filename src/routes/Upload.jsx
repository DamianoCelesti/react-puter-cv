import { useState } from "react";
import FileUploader from "../components/FileUploader";
import { usePuterStore } from "../lib/puter";
import { useNavigate } from "react-router-dom";
import { convertPdfToImage } from "../lib/pdf2img";
import { generateUUID } from "../lib/utils";
import { prepareInstructions } from "../lib/constants";

const Upload = () => {
    // Accesso alle risorse e servizi dall'app (auth, file system, AI, key-value store)
    const { auth, isLoading, fs, ai, kv } = usePuterStore();

    // Router navigation per cambiare pagina dopo l'analisi
    const navigate = useNavigate();

    // Stato che indica se è in corso l'elaborazione dell'upload/analisi
    const [isProcessing, setIsProcessing] = useState(false);

    // Testo di stato visualizzato durante l'elaborazione (es: uploading, converting, analyzing)
    const [statusText, setStatusText] = useState("");

    // File selezionato dall'utente (PDF)
    const [file, setFile] = useState(null);

    // Callback che riceve il file selezionato dal componente FileUploader
    const handleFileSelect = (file) => {
        setFile(file);
    };

    // Funzione principale che gestisce l'upload, conversione, salvataggio e analisi AI
    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }) => {
        setIsProcessing(true);

        // 1) Upload del file PDF sul filesystem interno (fs.upload)
        setStatusText("Uploading the file...");
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText("Error: Failed to upload file");

        // 2) Conversione del PDF in immagine per preview (convertPdfToImage)
        setStatusText("Converting to image...");
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText("Error: Failed to convert PDF to image");

        // 3) Upload dell'immagine generata per la preview
        setStatusText("Uploading the image...");
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText("Error: Failed to upload image");

        // 4) Preparazione dei dati da salvare in KV (id, path file, path immagine, metadati)
        setStatusText("Preparing data...");
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: "",
        };
        // Salvataggio preliminare in KV (consente di avere il record anche prima dell'analisi)
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        // 5) Richiesta di analisi al servizio AI con istruzioni preparate
        setStatusText("Analyzing...");

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        );
        if (!feedback) return setStatusText("Error: Failed to analyze resume");

        // 6) Estrarre il contenuto testuale dalla risposta (gestisce due possibili shape)
        const feedbackText =
            typeof feedback.message.content === "string"
                ? feedback.message.content
                : feedback.message.content[0].text;

        // 7) Parsare il JSON restituito dall'AI e aggiornare il record in KV
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        // 8) Fine analisi: aggiornamento stato e redirect alla pagina del resume analizzato
        setStatusText("Analysis complete, redirecting...");
        console.log(data);
        navigate(`/resume/${uuid}`);
    };

    // Gestione submit del form: estrazione dei campi e invio a handleAnalyze
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get("company-name");
        const jobTitle = formData.get("job-title");
        const jobDescription = formData.get("job-description");

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">


            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>

                    {/* Stato dinamico: mostra il progress text & animazione durante l'elaborazione */}
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}

                    {/* Form di upload visibile solo quando non è in corso l'elaborazione */}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                {/* Componente che gestisce il drag & drop / selezione file */}
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;
