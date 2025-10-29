import React from "react";

const ScoreBadge = ({ score }) => {
  return (
    <div
      className={`flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px] ${score > 69
          ? "bg-badge-green"
          : score > 39
            ? "bg-badge-yellow"
            : "bg-badge-red"
        }`}
    >
      <img
        src={
          score > 69
            ? "/icons/check.svg"
            : score > 39
              ? "/icons/warning.svg"
              : "/icons/warning.svg"
        }
        alt="score"
        className="size-3"
      />
      <p
        className={`text-xs font-medium ${score > 69
            ? "text-green-700"
            : score > 39
              ? "text-yellow-700"
              : "text-red-700"
          }`}
      >
        {score}/100
      </p>
    </div>
  );
};

export default ScoreBadge;
