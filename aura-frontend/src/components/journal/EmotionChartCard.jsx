import EmotionChart from "./EmotionChart";

export default function EmotionChartCard({
    emotions
}) {

    return (

        <div className="bg-white rounded-3xl shadow-sm p-6 h-[400px] flex flex-col">

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