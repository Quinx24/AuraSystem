import EmotionChart from "./EmotionChart";

export default function EmotionChartCard({
    emotions
}) {

    return (

        <div className="flex min-h-[360px] flex-col rounded-3xl bg-white p-4 shadow-sm md:min-h-[400px] md:p-6">

            <h2 className="text-xl font-semibold mb-6">
                Emotion Distribution
            </h2>

            <div
                className="
                    flex-1
                    flex
                    items-center
                "
            >
                <EmotionChart
                    emotions={emotions}
                />
            </div>

        </div>

    );

}
