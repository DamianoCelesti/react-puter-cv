import React, { createContext, useContext, useState } from "react";

const AccordionContext = createContext(undefined);

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error("Accordion components must be used within <Accordion>");
    }
    return context;
};

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
            <div className={`accordion ${className}`}>{children}</div>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({ id, children, className = "" }) {
    return (
        <div className={`accordion-item ${className}`} data-id={id}>
            {children}
        </div>
    );
}

export function AccordionHeader({ itemId, children, className = "" }) {
    const { toggleItem, isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <button
            type="button"
            onClick={() => toggleItem(itemId)}
            className={`accordion-header ${isActive ? "active" : ""} ${className}`}
            aria-expanded={isActive}
            aria-controls={`accordion-content-${itemId}`}
        >
            <div className="accordion-header-inner">{children}</div>
            <span className={`accordion-arrow ${isActive ? "open" : ""}`}>⌃</span>
        </button>
    );
}

export function AccordionContent({ itemId, children, className = "" }) {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <div
            id={`accordion-content-${itemId}`}
            role="region"
            aria-hidden={!isActive}
            className={`accordion-content ${isActive ? "open" : ""} ${className}`}
        >
            <div className="accordion-content-inner">{children}</div>
        </div>
    );
}

export default Accordion;
