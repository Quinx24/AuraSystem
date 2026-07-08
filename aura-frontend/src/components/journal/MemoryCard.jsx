import { Camera } from "lucide-react"

export default function MemoryCard({
    memoryPhoto,
    mode = "view",
    onPhotoChange
}) {
    return (
        <div
            className="
                relative
                bg-white
                rounded-xl
                p-4
                md:p-6
                border
                border-violet-100
                min-h-[320px]
                md:min-h-[370px]
                mb-6
                md:mb-8
            "
        >

            <div
                className="
                    absolute
                    -top-3
                    left-1/2
                    -translate-x-1/2
                    w-25
                    h-6
                    bg-pink-200
                    rotate-[-8deg]
                    rounded-sm
                    opacity-80
                    shadow-sm
                "
            />

            <h3 className="font-semibold mb-4">
                Memory Of The Day
            </h3>

            <div
                className="
                    h-48
                    md:h-56
                    bg-gradient-to-br
                    from-violet-50
                    to-pink-50
                    rounded-xl
                    overflow-hidden
                    mb-4
                    border-2
                    border-dashed
                    border-violet-200
                "
            >
                {memoryPhoto && memoryPhoto.trim() !== "" ? (
                    <img
                        src={memoryPhoto}
                        alt="Memory"
                        className="h-full w-full max-w-full object-cover"
                    />
                ) : (
                    <div
                        className="
                                            h-full
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            text-slate-400
                                        "
                    >
                        <div
                            className="
                                                w-16
                                                h-16
                                                rounded-full
                                                bg-white
                                                flex
                                                items-center
                                                justify-center
                                                shadow-sm
                                                mb-4
                                            "
                        >
                            <Camera
                                size={30}
                                className="text-violet-500"
                            />
                        </div>

                        <p className="font-medium text-slate-500">

                            {
                                mode === "edit"
                                    ? "No memory yet"
                                    : "No memory saved"
                            }

                        </p>

                        <p className="text-xs text-slate-400 mt-1">

                            {
                                mode === "edit"
                                    ? "Add a photo to remember today"
                                    : "This journal doesn't contain a memory photo."
                            }

                        </p>
                    </div>
                )}
            </div>

            {
                mode === "edit" && (

                    <label
                        className="
                            mx-auto
                            w-fit
                            px-6
                            py-2.5
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-violet-200
                            bg-white
                            text-violet-600
                            cursor-pointer
                            hover:bg-violet-50
                            transition
                        "
                    >

                        <Camera size={18} />

                        Add Photo

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onPhotoChange}
                        />

                    </label>

                )
            }
        </div>
    );
}
