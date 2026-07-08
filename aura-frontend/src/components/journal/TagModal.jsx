import { X } from "lucide-react";

export default function TagModal({

    searchTag,

    setSearchTag,

    suggestedTags,

    selectedTags,

    handleSelectTag,

    handleRemoveTag,

    onClose,

    onSave

}) {

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/30
                flex
                items-center
                justify-center
                z-50
            "
        >

            <div
                className="
                    w-[600px]
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-8
                "
            >

                {/* Header */}

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-3xl font-bold">
                        Add Tags
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-slate-500
                            hover:text-red-500
                            transition
                        "
                    >
                        <X size={24} />
                    </button>

                </div>

                {/* Search */}

                <div>

                    <label className="block font-semibold mb-3">

                        Search or create tags

                    </label>

                    <input

                        value={searchTag}

                        onChange={(e) =>
                            setSearchTag(e.target.value)
                        }

                        placeholder="Type tag..."

                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-violet-200
                            outline-none
                            focus:border-violet-500
                        "
                    />

                </div>

                {/* Suggested Tags */}

                <div className="mt-8">

                    <h3 className="font-semibold mb-4">
                        Suggested Tags
                    </h3>

                    <div
                        className="
                            max-h-72
                            overflow-y-auto
                            pr-2
                        "
                    >

                        <div className="flex flex-wrap gap-3">

                            {suggestedTags.map((tag) => (

                                <button
                                    key={tag.id}
                                    onClick={() => handleSelectTag(tag.name)}
                                    className="
                                        px-4
                                        py-2
                                        rounded-xl
                                        bg-violet-50
                                        text-violet-700
                                        hover:bg-violet-100
                                        transition
                                    "
                                >

                                    #{tag.name}

                                </button>

                            ))}

                        </div>

                    </div>

                </div>

                {/* Selected */}

                <div className="mt-8">

                    <h3 className="font-semibold mb-4">

                        Selected Tags

                    </h3>

                    <div className="flex flex-wrap gap-3">

                        {

                            selectedTags.length === 0

                                ? (

                                    <p className="text-slate-400">

                                        No tags selected.

                                    </p>

                                )

                                : (

                                    selectedTags.map((tag) => (

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
                                            "
                                        >

                                            <span>

                                                #{tag}

                                            </span>

                                            <X
                                                size={14}
                                                onClick={() => handleRemoveTag(tag)}
                                                className="
                                                    cursor-pointer
                                                    hover:text-red-500
                                                    transition-colors
                                                "
                                            />

                                        </div>

                                    ))

                                )

                        }

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 mt-10">

                    <button

                        onClick={onClose}

                        className="
                            px-5
                            py-2.5
                            rounded-xl
                            border
                            border-slate-300
                        "
                    >

                        Cancel

                    </button>

                    <button

                        onClick={onSave}

                        className="
                            px-6
                            py-2.5
                            rounded-xl
                            bg-violet-600
                            text-white
                            hover:bg-violet-700
                            transition
                        "
                    >

                        Save Tags

                    </button>

                </div>

            </div>

        </div>

    );

}