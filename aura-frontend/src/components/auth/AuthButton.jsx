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
                py-3
                rounded-xl
                bg-gradient-to-r
                from-violet-400
                to-violet-600
                text-white
                font-semibold
                hover:opacity-90
                disabled:opacity-50
                transition
            "
        >
            {text}
        </button>

    );
}