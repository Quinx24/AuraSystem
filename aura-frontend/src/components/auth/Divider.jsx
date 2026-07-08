export default function Divider() {
    return (

        <div className="flex items-center gap-4">

            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200"></div>

            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                or continue with
            </span>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200"></div>

        </div>

    );
}
