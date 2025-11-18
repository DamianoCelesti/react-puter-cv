// Funzione che decide il colore del badge in base al punteggio
const getBadgeColor = (score) => {
  if (score >= 80) return "green";   // Punteggio alto → verde
  if (score >= 60) return "yellow";  // Punteggio medio → giallo
  return "red";                      // Punteggio basso → rosso
};

// Componente che mostra un piccolo badge con etichetta e punteggio
const ScoreBadge = ({ label, score }) => {
  const color = getBadgeColor(score);
  // Determina il colore da usare in base al punteggio

  return (
    <div>
      <span>{label}:</span>     {/* Etichetta del tipo di punteggio */}
      <span>{score}%</span>     {/* Valore del punteggio in percentuale */}
      {/* Il colore calcolato non è ancora applicato, ma è disponibile come variabile */}
    </div>
  );
};

export default ScoreBadge;
