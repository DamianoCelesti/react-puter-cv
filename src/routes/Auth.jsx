import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const Auth = () => {
    // Prendo dallo store lo stato di autenticazione e il loader
    const { isLoading, auth } = usePuterStore();

    // Location mi serve per leggere eventuali query params tipo ?next=/dashboard
    const location = useLocation();

    // Navigate mi serve per fare redirect programmati
    const navigate = useNavigate();

    // Estraggo la query string e prendo "next" se esiste, altrimenti vado alla root
    const search = new URLSearchParams(location.search);
    const next = search.get("next") || "/";

    useEffect(() => {
        // Se l'utente è già autenticato, lo mando subito alla pagina indicata da "next"
        if (auth.isAuthenticated) {
            navigate(next, { replace: true });
            // replace: true evita che l'utente possa tornare indietro alla schermata Auth
        }
    }, [auth.isAuthenticated, next, navigate]);

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            {/* Contenitore con bordo gradient */}
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">

                    {/* Titolo e sottotitolo */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In per continuare...</h2>
                    </div>

                    <div>
                        {/* Se è in caricamento mostra un pulsante disabilitato con animazione */}
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>

                            // Se l'utente è autenticato mostro il tasto per fare logout
                        ) : auth.isAuthenticated ? (
                            <button className="auth-button" onClick={auth.signOut}>
                                <p>Log Out</p>
                            </button>

                            // Altrimenti mostro il tasto per fare login
                        ) : (
                            <button className="auth-button" onClick={auth.signIn}>
                                <p>Log In</p>
                            </button>
                        )}
                    </div>

                </section>
            </div>
        </main>
    );
};

export default Auth;
