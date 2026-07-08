export default function AuthButton({
    text,
    onClick,
    type = "button",
    disabled = false,
}) {

    return (

        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="
                w-full
                py-3.5
                rounded-2xl
                bg-gradient-to-r
                from-violet-500
                via-violet-600
                to-fuchsia-500
                text-white
                font-semibold
                shadow-md
                shadow-violet-200
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-lg
                hover:shadow-violet-200
                active:translate-y-0
                disabled:opacity-50
                disabled:hover:translate-y-0
            "
        >
            {text}
        </button>

    );
}
