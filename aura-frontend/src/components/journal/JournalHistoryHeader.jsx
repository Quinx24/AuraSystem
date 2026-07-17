import { useEffect } from "react";
import { usePageMeta } from "../../contexts/PageMetaContext";

export default function JournalHistoryHeader() {
    const { setPage } = usePageMeta();

    useEffect(() => {
        setPage({ title: "Journal History", breadcrumb: ["Home", "Journal History"] });
        return () => setPage({});
    }, [setPage]);

    return null;
}
