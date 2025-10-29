import React from "react";
import { cn } from "../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

/**
 * Badge compatto per mostrare il punteggio di categoria.
 * @param {{ score: number }} props
 */
const ScoreBadge = ({ score }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69 ? "bg-badge-green" : score > 39 ? "bg-badge-yellow" : "bg-badge-red"
      )}
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
        className={cn(
          "text-xs font-medium",
          score > 69
            ? "text-green-700"
            : score > 39
              ? "text-yellow-700"
              : "text-red-700"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

/**
 * Header di una categoria (titolo + badge punteggio).
 * @param {{ title: string, categoryScore: number }} props
 */
const CategoryHeader = ({ title, categoryScore }) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

/**
 * Contenuto espanso di una categoria: elenco consigli e spiegazioni.
 * @param {{ tips: Array<{type: "good"|"improve", tip: string, explanation: string}> }} props
 */
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

/**
 * Pannello dei dettagli con categorie a fisarmonica.
 * @param {{
 *   feedback: {
 *     toneAndStyle: { score: number, tips: Array<{type:"good"|"improve", tip:string, explanation:string}> },
 *     content:      { score: number, tips: Array<{type:"good"|"improve", tip:string, explanation:string}> },
 *     structure:    { score: number, tips: Array<{type:"good"|"improve", tip:string, explanation:string}> },
 *     skills:       { score: number, tips: Array<{type:"good"|"improve", tip:string, explanation:string}> },
 *   }
 * }} props
 */
const Details = ({ feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        {/* Tone & Style */}
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Content */}
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader title="Content" categoryScore={feedback.content.score} />
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
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader title="Skills" categoryScore={feedback.skills.score} />
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
