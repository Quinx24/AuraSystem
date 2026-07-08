import { X } from "lucide-react";

export default function TagSection({
    selectedTags,
    onRemoveTag,
    onOpenModal
}) {
    return (
        <div
            className="
                bg-white
                rounded-3xl
                border
                border-violet-100
                p-6
                shadow-sm
            "
        >
            <h3 className="font-semibold mb-4 text-lg">
                Tags
            </h3>

            <div className="flex flex-wrap gap-3">
                {selectedTags.map((tag) => (
                    <div
                        key={tag}
                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            bg-violet-100
                            text-violet-700
                            font-medium
                        "
                    >
                        <span>
                            # {tag}
                        </span>

                        <X
                            size={14}
                            className="
                                cursor-pointer
                                hover:text-red-500
                            "
                            onClick={() =>
                                onRemoveTag(tag)
                            }
                        />
                    </div>
                ))}

                <button
                    onClick={onOpenModal}
                    className="
                        px-5
                        py-2
                        rounded-xl
                        border
                        border-violet-200
                        text-violet-600
                        hover:bg-violet-50
                        transition
                    "
                >
                    + Add Tag
                </button>
            </div>
        </div>
    );
}
