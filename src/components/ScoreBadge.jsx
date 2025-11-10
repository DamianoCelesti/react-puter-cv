const getBadgeColor = (score) => {
  if (score >= 80) return "green";
  if (score >= 60) return "yellow";
  return "red";
};

const ScoreBadge = ({ label, score }) => {
  const color = getBadgeColor(score);

  return (
    <div>
      <span>{label}:</span>
      <span>{score}%</span>
    </div>
  );
};

export default ScoreBadge;
