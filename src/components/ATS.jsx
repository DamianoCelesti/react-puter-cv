// Definisco una funzione to100 che prende un numero n
const to100 = (n) => {
  // Converto n in numero; se n è null o undefined uso 0
  const x = Number(n ?? 0);

  // Se il numero è minore o uguale a 10 lo moltiplico per 10, altrimenti lo lascio così
  const scaled = x <= 10 ? x * 10 : x;

  // Arrotondo il valore e mi assicuro che rimanga tra 0 e 100
  return Math.max(0, Math.min(100, Math.round(scaled)));
};

/**
 * @param {{score: number, suggestions: Array<{type: "good"|"improve", tip: string}>}} props
 */
// Creo il componente ATS e destrutturo score e suggestions dai props
const ATS = ({ score, suggestions = [] }) => {
  // Converto il punteggio in una scala 0–100 usando la funzione to100
  const s = to100(score);

  // Decido la variante grafica della card in base al punteggio
  const cardVariant = s > 69 ? "good" : "warn";

  // Ritorno la struttura JSX del componente
  return (
    <div className={`ats-card ${cardVariant}`}>
      {/* Creo l’header con icona e titolo */}
      <div className="ats-header">
        <img src="/icons/ats-gear.svg" alt="ATS" className="ats-icon" />
        <h3 className="ats-title">ATS Compatibility</h3>
      </div>

      {/* Mostro il punteggio e una breve descrizione */}
      <div className="ats-score-wrap">
        <span className={`ats-score-pill ${cardVariant}`}>
          Score: {s}/100
        </span>
        <p className="ats-description">
          This score estimates how well your resume may pass Applicant Tracking
          Systems used by employers.
        </p>
      </div>

      {/* Stampo l’elenco dei suggerimenti */}
      <div className="ats-suggestions">
        {suggestions.map((sug, i) => (
          // Creo un blocco per ogni suggerimento con una classe basata sul tipo
          <div key={i} className={`ats-suggestion ${sug.type === "good" ? "good" : "improve"}`}>
            {/* Mostro l’icona corretta in base al tipo di suggerimento */}
            <img
              src={sug.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={sug.type === "good" ? "Good" : "Improve"}
              className="ats-suggestion-icon"
            />
            {/* Mostro il testo del suggerimento */}
            <p className="ats-suggestion-text">{sug.tip}</p>
          </div>
        ))}
      </div>

      {/* Mostro una nota finale all’utente */}
      <p className="ats-note">
        Continua a perfezionare il tuo CV per aumentare le probabilità che venga accettato dai sistemi di selezione automatica (ATS).
      </p>
    </div>
  );
};

// Esporto il componente per usarlo altrove
export default ATS;
