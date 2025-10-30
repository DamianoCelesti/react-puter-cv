import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { usePuterStore } from "./lib/puter";

export default function App() {
  const { init } = usePuterStore();
  useEffect(() => { init(); }, [init]);

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
