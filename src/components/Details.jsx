
import { cn } from "../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

// porta 0–10 a 0–100 (clamp a 0–100) ---
const to100 = (n) => {
  const x = Number(n ?? 0);
  const scaled = x <= 10 ? x * 10 : x;
  return Math.max(0, Math.min(100, Math.round(scaled)));
};

/** Badge compatto per mostrare il punteggio di categoria. */
const ScoreBadge = ({ score }) => {
  const s = to100(score);
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        s > 69 ? "bg-badge-green" : s > 39 ? "bg-badge-yellow" : "bg-badge-red"
      )}
    >
      <img
        src={
          s > 69
            ? "/icons/check.svg"
            : s > 39
              ? "/icons/warning.svg"
              : "/icons/warning.svg"
        }
        alt="score"
        className="size-3"
      />
      <p
        className={cn(
          "text-xs font-medium",
          s > 69 ? "text-green-700" : s > 39 ? "text-yellow-700" : "text-red-700"
        )}
      >
        {s}/100
      </p>
    </div>
  );
};

/** Header di una categoria (titolo + badge punteggio). */
const CategoryHeader = ({ title, categoryScore }) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

/** Contenuto espanso di una categoria: elenco consigli e spiegazioni. */
const CategoryContent = ({ tips }) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {/* Lista sintetica dei tip (bullet) */}
      <div className="flex flex-col gap-2 w-full">
        {tips.map((tip, index) => (
          <div key={index + tip.tip} className="flex flex-row gap-3 items-start">
            <img
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={tip.type === "good" ? "Good" : "Improve"}
              className="size-5"
            />
            <p className="text-xl text-gray-500">{tip.tip}</p>
          </div>
        ))}
      </div>

      {/* Box dettagliati con spiegazione */}
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip + "-detail"}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={tip.type === "good" ? "Good" : "Improve"}
                className="size-5"
              />
              <p className="font-medium">{tip.tip}</p>
            </div>
            <p className="text-sm leading-relaxed">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Pannello dei dettagli con categorie a fisarmonica. */
const Details = ({ feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        {/* Tone & Style */}
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={to100(feedback.toneAndStyle.score)}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Content */}
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={to100(feedback.content.score)}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Structure */}
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={to100(feedback.structure.score)}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={to100(feedback.skills.score)}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
