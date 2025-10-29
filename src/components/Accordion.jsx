import React, { createContext, useContext, useState } from "react";
import { cn } from "../lib/utils";

/**
 * Context e hook
 */
const AccordionContext = createContext(undefined);

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error("Accordion components must be used within <Accordion>");
    }
    return context;
};

/**
 * <Accordion>
 * - Gestisce lo stato degli item aperti
 * - Props:
 *   - className?: string
 *   - defaultActive?: string[]  (opzionale: item aperti all'inizio)
 */
export function Accordion({ children, className = "", defaultActive = [] }) {
    const [activeItems, setActiveItems] = useState(defaultActive);

    const toggleItem = (id) => {
        setActiveItems((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const isItemActive = (id) => activeItems.includes(id);

    return (
        <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
            <div className={cn("space-y-2", className)}>{children}</div>
        </AccordionContext.Provider>
    );
}

/**
 * <AccordionItem>
 * - Contenitore logico per header+content
 * - Props:
 *   - id: string  (identificativo univoco dell’item)
 *   - className?: string
 */
export function AccordionItem({ id, children, className = "" }) {
    // Non fa nulla di logico: serve come wrapper semantico
    return <div className={cn("rounded-lg border", className)} data-id={id}>{children}</div>;
}

/**
 * <AccordionHeader>
 * - Header cliccabile che apre/chiude l’item
 * - Props:
 *   - itemId: string   (deve combaciare con l'id dell'item)
 *   - className?: string
 */
export function AccordionHeader({ itemId, children, className = "" }) {
    const { toggleItem, isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <button
            type="button"
            onClick={() => toggleItem(itemId)}
            className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg",
                "bg-white hover:bg-gray-50 transition-colors",
                className
            )}
            aria-expanded={isActive}
            aria-controls={`accordion-content-${itemId}`}
        >
            <div className="flex items-center gap-3">{children}</div>
            <svg
                className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    isActive ? "rotate-180" : "rotate-0"
                )}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.06 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
            </svg>
        </button>
    );
}

/**
 * <AccordionContent>
 * - Contenuto collassabile dell’item
 * - Props:
 *   - itemId: string  (deve combaciare con l'id dell'item)
 *   - className?: string
 */
export function AccordionContent({ itemId, children, className = "" }) {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <div
            id={`accordion-content-${itemId}`}
            role="region"
            aria-hidden={!isActive}
            className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0",
                className
            )}
        >
            <div className="px-4 py-3">{children}</div>
        </div>
    );
}

export default Accordion;
