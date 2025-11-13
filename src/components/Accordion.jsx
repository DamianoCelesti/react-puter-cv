// Importo da React le funzioni che mi servono:
// - createContext: mi serve per creare un contesto condiviso
// - useContext: mi serve per accedere a quel contesto
// - useState: mi serve per gestire lo stato locale del componente
import { createContext, useContext, useState } from "react";

// Creo un contesto che userò per far comunicare i vari componenti dell’accordion
// (come Header, Content, ecc.) senza dover passare props manualmente.
const AccordionContext = createContext(undefined);

// Creo un hook personalizzato per accedere facilmente al contesto dell’accordion.
// In questo modo posso semplicemente scrivere "useAccordion()" invece di "useContext(AccordionContext)".
const useAccordion = () => {
    // Recupero il valore del contesto corrente
    const context = useContext(AccordionContext);

    // Se provo a usare questo hook fuori da <Accordion>, lancio un errore,
    // così evito comportamenti imprevisti.
    if (!context) {
        throw new Error("Accordion components must be used within <Accordion>");
    }

    // Ritorno il contesto, che contiene funzioni e stato condiviso.
    return context;
};

// Questo è il componente principale dell’accordion.
// Mi occupo di gestire quali elementi sono aperti o chiusi
// e di condividere queste informazioni con i componenti figli tramite il context.
export function Accordion({ children, className = "", defaultActive = [] }) {
    // Creo uno stato per tenere traccia degli ID degli elementi attivi (aperti).
    // Posso anche passare un array di ID già attivi di default.
    const [activeItems, setActiveItems] = useState(defaultActive);

    // Creo una funzione che apre o chiude un elemento in base al suo ID.
    // Se l’ID è già nell’array degli attivi, lo rimuovo (lo chiudo);
    // se non c’è, lo aggiungo (lo apro).
    const toggleItem = (id) => {
        setActiveItems((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Creo una funzione di utilità che mi dice se un certo item è attivo o meno.
    const isItemActive = (id) => activeItems.includes(id);

    // Ritorno il markup dell’accordion.
    // Qui uso un Provider per rendere disponibili le funzioni e lo stato
    // a tutti i componenti figli (Header, Content, ecc.).
    return (
        <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
            <div className={`accordion ${className}`}>{children}</div>
        </AccordionContext.Provider>
    );
}

// Questo componente rappresenta un singolo elemento dell’accordion.
// Lo uso come contenitore per Header e Content.
export function AccordionItem({ id, children, className = "" }) {
    return (
        // Assegno un data-id per identificare facilmente questo item.
        <div className={`accordion-item ${className}`} data-id={id}>
            {children}
        </div>
    );
}

// Questo è l’header dell’accordion: la parte cliccabile che apre o chiude la sezione.
export function AccordionHeader({ itemId, children, className = "" }) {
    // Recupero dal contesto le funzioni che mi servono per gestire l’apertura e la chiusura.
    const { toggleItem, isItemActive } = useAccordion();

    // Controllo se questo item è attualmente attivo (aperto).
    const isActive = isItemActive(itemId);

    // Ritorno il bottone che gestisce l’interazione dell’utente.
    return (
        <button
            type="button"
            onClick={() => toggleItem(itemId)} // Quando clicco, apro o chiudo l’item
            className={`accordion-header ${isActive ? "active" : ""} ${className}`} // Aggiungo la classe "active" se aperto
            aria-expanded={isActive} // Attributo ARIA per accessibilità (true se aperto)
            aria-controls={`accordion-content-${itemId}`} // Collego l’header al suo contenuto
        >
            {/* Qui mostro il contenuto dell’intestazione, di solito un titolo o testo */}
            <div className="accordion-header-inner">{children}</div>

            {/* Aggiungo una freccia che cambia orientamento quando l’item è aperto */}
            <span className={`accordion-arrow ${isActive ? "open" : ""}`}>⌃</span>
        </button>
    );
}

// Questo è il contenuto espandibile dell’accordion, che viene mostrato o nascosto
// a seconda che l’item sia attivo o meno.
export function AccordionContent({ itemId, children, className = "" }) {
    // Recupero la funzione che mi dice se un item è attivo.
    const { isItemActive } = useAccordion();

    // Verifico se questo item è aperto.
    const isActive = isItemActive(itemId);

    // Ritorno il markup del contenuto.
    return (
        <div
            id={`accordion-content-${itemId}`} // Collego l’ID al corrispondente header
            role="region" // Attributo ARIA per indicare che è una regione espandibile
            aria-hidden={!isActive} // Nascondo ai lettori di schermo se non è attivo
            className={`accordion-content ${isActive ? "open" : ""} ${className}`} // Applico la classe "open" se attivo
        >
            {/* Qui metto il contenuto vero e proprio che voglio mostrare */}
            <div className="accordion-content-inner">{children}</div>
        </div>
    );
}

// Esporto il componente principale come default, così posso importarlo facilmente altrove.
export default Accordion;
