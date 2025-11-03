import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { useEffect } from "react";
import { usePuterStore } from "./lib/puter"; // ⬅️ nuovo import

export default function App() {
  const { init } = usePuterStore();          // ⬅️ usa lo store

  useEffect(() => {
    init();                                  // ⬅️ inizializza Puter (carica window.puter, checkAuth, ecc.)
  }, [init]);

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
