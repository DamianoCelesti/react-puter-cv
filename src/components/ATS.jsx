
/**
 * @param {{score: number, suggestions: Array<{type: "good"|"improve", tip: string}>}} props
 */
const ATS = ({ score, suggestions = [] }) => {
  // Modificatori di stile basati sul punteggio
  const cardVariant = score > 69 ? "good" : "warn";

  return (
    <div className={`ats-card ${cardVariant}`}>
      {/* Header */}
      <div className="ats-header">
        <img
          src="/icons/ats-gear.svg"
          alt="ATS"
          className="ats-icon"
        />
        <h3 className="ats-title">ATS Compatibility</h3>
      </div>

      {/* Score pill */}
      <div className="ats-score-wrap">
        <span className={`ats-score-pill ${cardVariant}`}>
          Score: {score}/100
        </span>
        <p className="ats-description">
          This score estimates how well your resume may pass Applicant Tracking
          Systems used by employers.
        </p>
      </div>

      {/* Suggestions */}
      <div className="ats-suggestions">
        {suggestions.map((s, i) => (
          <div key={i} className={`ats-suggestion ${s.type === "good" ? "good" : "improve"}`}>
            <img
              src={s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={s.type === "good" ? "Good" : "Improve"}
              className="ats-suggestion-icon"
            />
            <p className="ats-suggestion-text">{s.tip}</p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="ats-note">
        Keep refining your resume to boost your chances of clearing ATS filters.
      </p>
    </div>
  );
};

export default ATS;
