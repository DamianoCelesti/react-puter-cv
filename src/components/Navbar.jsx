import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const Navbar = () => {
    const navigate = useNavigate();
    const { auth, isLoading } = usePuterStore();
    const [darkMode, setDarkMode] = useState(false);

    // Legge il tema salvato al primo avvio
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // Funzione per cambiare tema
    const toggleTheme = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        document.documentElement.classList.toggle("dark", newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } finally {
            navigate("/auth?next=/");
        }
    };

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-gradient">RESUME</p>
            </Link>

            <div className="nav-right">
                {/* Bottone tema */}
                <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    title={darkMode ? "Passa al tema chiaro" : "Passa al tema scuro"}
                >
                    {darkMode ? "🌙" : "☀️"}
                </button>

                {/* Badge stato login */}
                <span
                    className={
                        "score-badge " +
                        (isLoading ? "neutral" : auth.isAuthenticated ? "green" : "red")
                    }
                    title={
                        isLoading
                            ? "Verifica in corso…"
                            : auth.isAuthenticated
                                ? "Logged in"
                                : "Not logged in"
                    }
                >
                    {isLoading
                        ? "Verifica in corso…"
                        : auth.isAuthenticated
                            ? `@${auth.user?.username ?? "user"}`
                            : "Non loggato"}
                </span>

                {/* Log In / Log Out */}
                {!isLoading &&
                    (auth.isAuthenticated ? (
                        <button onClick={handleLogout} className="primary-button logout-button">
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
