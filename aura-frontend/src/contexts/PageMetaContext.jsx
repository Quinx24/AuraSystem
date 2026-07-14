import { createContext, useContext } from "react";

export const PageMetaContext = createContext(null);

export function usePageMeta() {
    const ctx = useContext(PageMetaContext);
    if (!ctx) {
        throw new Error("usePageMeta must be used within PageMetaProvider");
    }

    return ctx;
}
