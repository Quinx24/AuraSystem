import { useCallback, useMemo, useState } from "react";
import { PageMetaContext } from "./PageMetaContext";

export default function PageMetaProvider({ children }) {
    const [meta, setMeta] = useState({});

    const setPage = useCallback((next) => {
        setMeta(next || {});
    }, []);

    const value = useMemo(() => ({ meta, setPage }), [meta, setPage]);

    return (
        <PageMetaContext.Provider value={value}>
            {children}
        </PageMetaContext.Provider>
    );
}
