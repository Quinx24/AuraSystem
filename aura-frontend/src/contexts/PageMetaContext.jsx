import { createContext, useContext, useState } from "react";

const PageMetaContext = createContext(null);

export function PageMetaProvider({ children }) {
    const [meta, setMeta] = useState({});

    return (
        <PageMetaContext.Provider value={{ meta, setMeta }}>
            {children}
        </PageMetaContext.Provider>
    );
}

export function usePageMeta() {
    const ctx = useContext(PageMetaContext);
    if (!ctx) {
        throw new Error("usePageMeta must be used within PageMetaProvider");
    }

    const { meta, setMeta } = ctx;

    // Replace previous behavior (merge). Now replace meta entirely to avoid stale/merged state.
    const setPage = (next) => setMeta(next || {});

    return { meta, setPage };
}
