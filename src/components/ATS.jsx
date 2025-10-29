import React from "react";
// Se usi una utility className combiner, aggiorna l'import:
// import { cn } from "../lib/utils";

/**
 * @param {{score: number, suggestions: Array<{type: "good"|"improve", tip: string}>}} props
 */
const ATS = ({ score, suggestions = [] }) => {
  // Gradient di sfondo in base al punteggio
  const gradientClass = score > 69 ? "from-green-100" : "from-amber-100";

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${gradientClass} to-white border`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src="/icons/ats-gear.svg"
          alt="ATS"
          className="w-6 h-6"
        />
        <h3 className="text-lg font-semibold">ATS Compatibility</h3>
      </div>

      {/* Score pill */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${score > 69
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
            }`}
        >
          Score: {score}/100
        </span>
        <p className="text-gray-600 mt-2">
          This score estimates how well your resume may pass Applicant Tracking
          Systems used by employers.
        </p>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <img
              src={s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={s.type === "good" ? "Good" : "Improve"}
              className="w-5 h-5 mt-1"
            />
            <p
              className={
                s.type === "good" ? "text-green-700" : "text-amber-700"
              }
            >
              {s.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-gray-700 italic mt-6">
        Keep refining your resume to boost your chances of clearing ATS filters.
      </p>
    </div>
  );
};

export default ATS;
