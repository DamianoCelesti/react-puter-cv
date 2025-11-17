import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

/**
 * Componente uploader PDF con supporto drag & drop.
 * Props:
 *  - onFileSelect?: callback che riceve il file selezionato oppure null
 */
const FileUploader = ({ onFileSelect }) => {
    // Stato che contiene il file caricato
    const [file, setFile] = useState(null);

    // Stato per mostrare eventuali errori (es. tipo errato o dimensioni eccessive)
    const [errorMsg, setErrorMsg] = useState("");

    // Dimensione massima consentita: 20 MB
    const maxFileSize = 20 * 1024 * 1024;

    // Funzione chiamata da react-dropzone quando vengono droppati dei file
    const onDrop = useCallback(
        (acceptedFiles, fileRejections) => {
            // Se ci sono file rifiutati, estrarre il primo e mostrare il messaggio d’errore
            if (fileRejections && fileRejections.length > 0) {
                const first = fileRejections[0];
                const reasons = first.errors?.map((e) => e.message).join(", ");

                setErrorMsg(reasons || "File non valido.");
                setFile(null);

                // Informare il parent che nessun file valido è stato selezionato
                onFileSelect?.(null);
                return;
            }

            // Altrimenti prendere il primo file accettato
            const f = acceptedFiles[0] || null;

            setErrorMsg("");
            setFile(f);

            // Notifica al parent del file selezionato
            onFileSelect?.(f || null);
        },
        [onFileSelect]
    );

    // Proprietà e stati forniti da react-dropzone per gestire l’area di drop
    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            multiple: false,                    // Permette un solo file
            accept: { "application/pdf": [".pdf"] }, // Accetta solo PDF
            maxSize: maxFileSize,               // Limita la dimensione
        });

    // Funzione che rimuove il file selezionato
    const clearFile = () => {
        setFile(null);
        setErrorMsg("");
        onFileSelect?.(null);
    };

    return (
        <div className="w-full">
            {/* Contenitore principale per il drag & drop */}
            <div
                {...getRootProps()}
                className={
                    `uploader-drag-area` +
                    (isDragActive ? " is-drag-active" : "") +        // Attiva stile in drag
                    ((isDragReject || errorMsg) ? " is-drag-reject" : "") // Evidenzia errori
                }
            >
                {/* Input reale gestito da react-dropzone (invisibile) */}
                <input {...getInputProps()} />

                {/* Se nessun file è stato scelto → mostra prompt di caricamento */}
                {!file && (
                    <div className="flex flex-col items-center text-center gap-4">
                        <img
                            src="/icons/pdf.png"
                            alt="PDF"
                            className="w-12 h-12 opacity-80"
                        />

                        {/* Testi informativi */}
                        <div className="space-y-1">
                            <p className="text-lg text-gray-600">
                                <span className="font-semibold">Clicca</span> o trascina qui il
                                tuo PDF
                            </p>
                            <p className="text-sm text-gray-500">
                                Dimensione massima: {formatSize(maxFileSize)}
                            </p>
                        </div>

                        {/* Messaggio di errore quando il file trascinato è rifiutato */}
                        {isDragReject && (
                            <p className="text-sm text-red-600">
                                Solo file PDF fino a {formatSize(maxFileSize)}.
                            </p>
                        )}

                        {/* Errori generati da react-dropzone o validazioni */}
                        {!!errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                    </div>
                )}

                {/* Se un file è selezionato → mostra un’anteprima compatta */}
                {file && (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src="/icons/pdf.png"
                                alt="PDF"
                                className="w-8 h-8 opacity-80 shrink-0"
                            />

                            {/* Nome e dimensione file, con truncation se troppo lunghi */}
                            <div className="min-w-0">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                            </div>
                        </div>

                        {/* Bottone per rimuovere il file selezionato */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // Evita riapertura del file picker
                                clearFile();
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-100"
                            aria-label="Rimuovi file"
                        >
                            <img
                                src="/icons/cross.svg"
                                alt=""
                                className="w-4 h-4"
                                aria-hidden="true"
                            />
                            <span>Rimuovi</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Nota finale sui formati supportati */}
            <p className="text-xs text-gray-500 mt-3">
                Supporto: PDF. Seleziona un solo file.
            </p>
        </div>
    );
};

export default FileUploader;
