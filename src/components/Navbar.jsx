import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const Navbar = () => {
    const navigate = useNavigate();
    const { auth, isLoading } = usePuterStore();

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
