import React from "react";
import { Link } from "react-router-dom";
import { usePuterStore } from "../lib/puter";

const Navbar = () => {
    const { auth, isLoading } = usePuterStore();

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>

            <div className="flex items-center gap-3">
                {/* Badge stato login */}
                <span
                    className={[
                        "px-3 py-1 rounded-full text-sm font-medium",
                        isLoading
                            ? "bg-gray-100 text-gray-700"
                            : auth.isAuthenticated
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700",
                    ].join(" ")}
                    title={isLoading ? "Checking session..." : auth.isAuthenticated ? "Logged in" : "Not logged in"}
                >
                    {isLoading ? "Verifica in corso…" : auth.isAuthenticated ? `@${auth.user?.username}` : "Non loggato"}
                </span>

                {/* Pulsante log in/out */}
                {isLoading ? null : auth.isAuthenticated ? (
                    <button
                        onClick={auth.signOut}
                        className="border px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                        Log Out
                    </button>
                ) : (
                    <Link to="/auth?next=/">
                        <button className="border px-3 py-2 rounded-lg hover:bg-gray-100">
                            Log In
                        </button>
                    </Link>
                )}

                {/* Tasto upload già presente */}
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
