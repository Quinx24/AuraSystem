import {
    Lightbulb,
    Sparkles
} from "lucide-react";
import InspirationCard from "./InspirationCard";

export default function RightPanel({
    currentPrompts,
    loadingPrompt,
    onRefresh
}) {
    return (
        <div className="min-w-0 space-y-6 xl:col-span-3">
            <div
                className="
                    bg-white
                    rounded-2xl
                    p-5
                    border
                    border-violet-100
                    shadow-sm
                "
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Lightbulb
                                size={18}
                                className="text-amber-400"
                            />

                            <h3 className="font-semibold text-slate-900">
                                Note Motivation
                            </h3>
                        </div>

                        <p className="mt-4 text-sm leading-7 font-medium text-slate-800">
                            Take a moment to reflect and write from the heart.
                        </p>
                    </div>

                    <div
                        className="
                            relative
                            grid
                            h-20
                            w-20
                            shrink-0
                            place-items-center
                        "
                    >
                        <Sparkles
                            size={16}
                            className="absolute right-1 top-0 text-violet-400"
                        />

                        <Sparkles
                            size={13}
                            className="absolute left-1 top-5 text-amber-300"
                        />

                        <div
                            className="
                                grid
                                h-16
                                w-16
                                place-items-center
                                rounded-full
                                bg-violet-100
                                text-3xl
                                shadow-inner
                            "
                        >
                            :)
                        </div>
                    </div>
                </div>
            </div>

            <InspirationCard
                currentPrompts={currentPrompts}
                loadingPrompt={loadingPrompt}
                onRefresh={onRefresh}
            />
        </div>
    );
}
