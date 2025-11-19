import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const WipeApp = () => {
    // Estraggo dallo store i servizi disponibili: autenticazione,
    // stato di caricamento, eventuali errori, funzioni per file system,
    // AI e key-value store.
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();

    // Hook di React Router per effettuare redirect programmati.
    const navigate = useNavigate();

    // Stato locale che contiene la lista dei file presenti nella root "./".
    const [files, setFiles] = useState([]);

    // Funzione che carica i file presenti nella directory principale dell'utente.
    const loadFiles = async () => {
        const files = await fs.readDir("./"); // Legge la root del namespace utente.
        setFiles(files); // Aggiorna lo stato con i file trovati.
    };

    // Al primo render, carico la lista dei file.
    useEffect(() => {
        loadFiles();
    }, []);

    // Se l'utente non è autenticato, viene reindirizzato alla pagina di login.
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe"); // Mantiene il redirect di ritorno a Wipe.
        }
    }, [isLoading]);

    // Funzione che elimina tutti i file e il contenuto del key-value store.
    const handleDelete = async () => {
        // Ciclo su ciascun file e lo elimino dal filesystem.
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });

        // Elimino tutte le chiavi presenti nel KV store.
        await kv.flush();

        // Ricarico la lista dei file per aggiornare l'interfaccia.
        loadFiles();
    };

    // Se il caricamento è ancora in corso, mostro un semplice messaggio di loading.
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // In caso di errore generale dello store, lo mostro all'utente.
    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div>
            {/* Mostro username dell’utente autenticato */}
            Authenticated as: {auth.user?.username}

            <div>Existing files:</div>

            {/* Lista dei file attualmente presenti nel filesystem utente */}
            <div className="flex flex-col gap-4">
                {files.map((file) => (
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.name}</p>
                    </div>
                ))}
            </div>

            {/* Pulsante che avvia la procedura di wipe totale */}
            <div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => handleDelete()}
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    );
};

export default WipeApp;
