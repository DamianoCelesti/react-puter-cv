import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

/**
 * Uploader PDF con drag&drop.
 * Props:
 *  - onFileSelect?: (file | null) => void
 */
const FileUploader = ({ onFileSelect }) => {
    const [file, setFile] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const maxFileSize = 20 * 1024 * 1024; // 20 MB

    const onDrop = useCallback(
        (acceptedFiles, fileRejections) => {
            // Gestione errori
            if (fileRejections && fileRejections.length > 0) {
                const first = fileRejections[0];
                const reasons = first.errors?.map((e) => e.message).join(", ");
                setErrorMsg(reasons || "File non valido.");
                setFile(null);
                onFileSelect?.(null);
                return;
            }

            const f = acceptedFiles[0] || null;
            setErrorMsg("");
            setFile(f);
            onFileSelect?.(f || null);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            multiple: false,
            accept: { "application/pdf": [".pdf"] },
            maxSize: maxFileSize,
        });

    const clearFile = () => {
        setFile(null);
        setErrorMsg("");
        onFileSelect?.(null);
    };

    return (
        <div className="w-full">
            {/* Box */}
            <div
                {...getRootProps()}
                className={[
                    "border-2 border-dashed rounded-2xl p-6 sm:p-10 cursor-pointer transition",
                    "bg-white hover:bg-gray-50",
                    isDragActive ? "border-blue-500" : "border-gray-300",
                    isDragReject || errorMsg ? "border-red-400" : "",
                ].join(" ")}
            >
                <input {...getInputProps()} />

                {/* Stato: nessun file → prompt upload */}
                {!file && (
                    <div className="flex flex-col items-center text-center gap-4">
                        <img
                            src="/icons/pdf.png"
                            alt="PDF"
                            className="w-12 h-12 opacity-80"
                        />
                        <div className="space-y-1">
                            <p className="text-lg text-gray-600">
                                <span className="font-semibold">Clicca</span> o trascina qui il
                                tuo PDF
                            </p>
                            <p className="text-sm text-gray-500">
                                Dimensione massima: {formatSize(maxFileSize)}
                            </p>
                        </div>
                        {isDragReject && (
                            <p className="text-sm text-red-600">
                                Solo file PDF fino a {formatSize(maxFileSize)}.
                            </p>
                        )}
                        {!!errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                    </div>
                )}

                {/* Stato: file selezionato → anteprima riga */}
                {file && (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src="/icons/pdf.png"
                                alt="PDF"
                                className="w-8 h-8 opacity-80 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
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

            {/* Nota formati */}
            <p className="text-xs text-gray-500 mt-3">
                Supporto: PDF. Seleziona un solo file.
            </p>
        </div>
    );
};

export default FileUploader;
