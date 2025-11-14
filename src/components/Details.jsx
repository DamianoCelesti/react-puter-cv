// Importo la funzione di utilità cn per concatenare className condizionali
import { cn } from "../lib/utils";
// Importo i componenti Accordion dal mio file locale
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

// porto 0–10 a 0–100 (clamp a 0–100) ---
// Definisco una funzione che normalizza un valore su scala 0–100
const to100 = (n) => {
  // Io converto n in Number; se n è null/undefined uso 0
  const x = Number(n ?? 0);
  // Io moltiplico per 10 se il valore è <= 10 (gestisco scala 0-10), altrimenti lo lascio com'è
  const scaled = x <= 10 ? x * 10 : x;
  // Io arrotondo il valore e lo vincolo tra 0 e 100
  return Math.max(0, Math.min(100, Math.round(scaled)));
};

/** Badge compatto per mostrare il punteggio di categoria. */
// Componente che mostra un piccolo badge con il punteggio
const ScoreBadge = ({ score }) => {
  // Io normalizzo il punteggio a 0–100
  const s = to100(score);
  return (
    <div
      // Io costruisco la classe della card usando cn e scelgo il background in base al punteggio
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        s > 69 ? "bg-badge-green" : s > 39 ? "bg-badge-yellow" : "bg-badge-red"
      )}
    >
      <img
        // Io scelgo l'icona in base alle soglie di punteggio
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
        // Io imposto lo stile del testo del badge in base al punteggio
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
// Componente che mostra il titolo della categoria e il suo ScoreBadge
const CategoryHeader = ({ title, categoryScore }) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      {/* Io mostro il titolo della categoria */}
      <p className="text-2xl font-semibold">{title}</p>
      {/* Io riporto il badge compatto con il punteggio della categoria */}
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

/** Contenuto espanso di una categoria: elenco consigli e spiegazioni. */
// Componente che mostra i tips (sintesi + box dettagliati)
const CategoryContent = ({ tips }) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {/* Lista sintetica dei tip (bullet) */}
      <div className="flex flex-col gap-2 w-full">
        {tips.map((tip, index) => (
          // Io mappo ogni tip in una riga sintetica con icona + testo
          <div key={index + tip.tip} className="flex flex-row gap-3 items-start">
            <img
              // Io scelgo l'icona check o warning in base al tipo del tip
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={tip.type === "good" ? "Good" : "Improve"}
              className="size-5"
            />
            {/* Io mostro il testo principale del tip */}
            <p className="text-xl text-gray-500">{tip.tip}</p>
          </div>
        ))}
      </div>

      {/* Box dettagliati con spiegazione */}
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          // Io mappo nuovamente per creare i box dettagli con spiegazione
          <div
            key={index + tip.tip + "-detail"}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              // Io scelgo lo stile (sfondo, bordo, colore testo) in base al tipo del tip
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                // Io riporto l'icona anche nel box dettagli
                src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={tip.type === "good" ? "Good" : "Improve"}
                className="size-5"
              />
              {/* Io mostro il titolo breve del tip nel box */}
              <p className="font-medium">{tip.tip}</p>
            </div>
            {/* Io mostro la spiegazione dettagliata del tip */}
            <p className="text-sm leading-relaxed">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Pannello dei dettagli con categorie a fisarmonica. */
// Componente principale che organizza le categorie dentro un Accordion
const Details = ({ feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        {/* Tone & Style */}
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            {/* Io uso CategoryHeader passando il titolo e il punteggio normalizzato */}
            <CategoryHeader
              title="Tone & Style"
              categoryScore={to100(feedback.toneAndStyle.score)}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            {/* Io mostro il contenuto dettagliato per questa categoria */}
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

// Esporto il componente Details come default export
export default Details;
