// src/lib/pdf2img.js

// 1) Import ESM della libreria e del worker come URL (gestito da Vite)
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// 2) Dì a PDF.js dove trovare il worker emesso da Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// 3) Funzione di conversione: identica alla tua API pubblica
export async function convertPdfToImage(file) {
    try {
        // Leggi il PDF come ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Carica il documento con la stessa istanza di pdfjsLib
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        // Prima pagina
        const page = await pdf.getPage(1);

        // Viewport (riduci a 3 se file molto pesanti)
        const viewport = page.getViewport({ scale: 4 });

        // Canvas di rendering
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        // Render della pagina sul canvas
        await page.render({ canvasContext: context, viewport }).promise;

        // Esporta PNG dal canvas
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
