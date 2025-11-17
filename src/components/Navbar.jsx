import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const Navbar = () => {
    const navigate = useNavigate();
    // Uso il hook di React Router per poter fare redirect in modo programmatico

    const { auth, isLoading } = usePuterStore();
    // Recupero dallo store lo stato di autenticazione e il flag di caricamento

    const [darkMode, setDarkMode] = useState(false);
    // Mantengo nello state il tema corrente così posso sincronizzare UI e logica

    // Al montaggio del componente controllo se l'utente aveva già scelto un tema
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        // Leggo il valore persistito da sessioni precedenti

        if (saved === "dark") {
            setDarkMode(true);
            // Sincronizzo il mio state col valore salvato

            document.documentElement.classList.add("dark");
            // Attivo immediatamente la classe CSS sul tag <html>
        }
    }, []);

    // Gestisco il passaggio tra tema chiaro e scuro
    const toggleTheme = () => {
        const newTheme = !darkMode;
        // Calcolo il nuovo valore basandomi su quello attuale

        setDarkMode(newTheme);
        // Aggiorno lo state così React si occupa di rerenderizzare la UI

        document.documentElement.classList.toggle("dark", newTheme);
        // Aggiorno la classe sul <html> per applicare gli stili corrispondenti

        localStorage.setItem("theme", newTheme ? "dark" : "light");
        // Salvo la scelta in localStorage per mantenerla nelle sessioni future
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            // Eseguo il logout tramite l’SDK Puter
        } finally {
            navigate("/auth?next=/");
            // Dopo il logout reindirizzo l'utente alla pagina di login
        }
    };

    return (
        <nav className="navbar">
            {/* Link verso la homepage */}
            <Link to="/">
                <p className="text-gradient">RESUME</p>
            </Link>

            <div className="nav-right">

                {/* Pulsante che permette lo switch tra i temi */}
                <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    title={darkMode ? "Passa al tema chiaro" : "Passa al tema scuro"}
                >
                    {/* Mostro un'icona diversa in base allo state */}
                    {darkMode ? "🌙" : "☀️"}
                </button>

                {/* Badge che mostra lo stato dell'utente (logged, loading, not logged) */}
                <span
                    className={
                        "score-badge " +
                        (
                            isLoading
                                ? "neutral"    // L’app sta verificando la sessione
                                : auth.isAuthenticated
                                    ? "green"   // Utente autenticato
                                    : "red"     // Utente non autenticato
                        )
                    }
                    title={
                        isLoading
                            ? "Verifica in corso…"
                            : auth.isAuthenticated
                                ? "Logged in"
                                : "Not logged in"
                    }
                >
                    {/* Render dinamico del testo nel badge */}
                    {isLoading
                        ? "Verifica in corso…"
                        : auth.isAuthenticated
                            ? `@${auth.user?.username ?? "user"}`
                            : "Non loggato"}
                </span>

                {/* Mostro il pulsante corretto in base allo stato di login */}
                {!isLoading &&
                    (auth.isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="primary-button logout-button"
                        >
                            Log Out
                        </button>
                    ) : (
                        <Link to="/auth?next=/" className="primary-button">
                            Log In
                        </Link>
                    ))}
            </div>
        </nav>
    );
};

export default Navbar;
