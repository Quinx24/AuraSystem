import { emotionConfig } from "../../utils/emotionUtils";

export default function EmotionDot(props) {

    const {
        cx,
        cy,
        payload
    } = props;

    const config =
        emotionConfig[payload.emotion];

    if (!config) {
        return null;
    }

    return (

        <g>

            <circle
                cx={cx}
                cy={cy}
                r={14}
                fill="white"
                stroke="#E5E7EB"
                strokeWidth={2}
            />

            <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
            >
                {config.emoji}
            </text>

        </g>

    );

}