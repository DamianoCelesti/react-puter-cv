

const to100 = (n) => {
  const x = Number(n ?? 0);
  const scaled = x <= 10 ? x * 10 : x;
  return Math.max(0, Math.min(100, Math.round(scaled)));
};

/**
 * @param {{score: number, suggestions: Array<{type: "good"|"improve", tip: string}>}} props
 */
const ATS = ({ score, suggestions = [] }) => {
  const s = to100(score);
  const cardVariant = s > 69 ? "good" : "warn";

  return (
    <div className={`ats-card ${cardVariant}`}>
      <div className="ats-header">
        <img src="/icons/ats-gear.svg" alt="ATS" className="ats-icon" />
        <h3 className="ats-title">ATS Compatibility</h3>
      </div>

      <div className="ats-score-wrap">
        <span className={`ats-score-pill ${cardVariant}`}>
          Score: {s}/100
        </span>
        <p className="ats-description">
          This score estimates how well your resume may pass Applicant Tracking
          Systems used by employers.
        </p>
      </div>

      <div className="ats-suggestions">
        {suggestions.map((sug, i) => (
          <div key={i} className={`ats-suggestion ${sug.type === "good" ? "good" : "improve"}`}>
            <img
              src={sug.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={sug.type === "good" ? "Good" : "Improve"}
              className="ats-suggestion-icon"
            />
            <p className="ats-suggestion-text">{sug.tip}</p>
          </div>
        ))}
      </div>

      <p className="ats-note">
        Continua a perfezionare il tuo CV per aumentare le probabilità che venga accettato dai sistemi di selezione automatica (ATS).
      </p>
    </div>
  );
};

export default ATS;
