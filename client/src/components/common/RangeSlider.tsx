import {
    Label,
    Slider,
    SliderOutput,
    SliderThumb,
    SliderTrack,
    SliderProps,
} from "react-aria-components";
import { format } from "@react-input/number-format";
import clsx from "clsx";

interface MySliderProps<T> extends SliderProps<T> {
    label?: string;
    thumbLabels?: string[];
}

function RangeSlider<T extends number | number[]>({
    label,
    thumbLabels,
    ...props
}: MySliderProps<T>) {
    return (
        <Slider {...props} className="w-120" dir="rtl">
            {label && (
                <Label className="block text-sm font-medium mb-1">
                    {label}
                </Label>
            )}

            <SliderTrack className="relative w-full h-7">
                {({ state }) => {
                    const minPercent = state.getThumbPercent(0) * 100;
                    const maxPercent = state.getThumbPercent(1) * 100;
                    const fillWidth = maxPercent - minPercent;

                    return (
                        <>
                            {/* Track Background */}
                            <div className="absolute inset-0 h-1 top-1/2 -translate-y-1/2 w-full rounded-full bg-action-soft dark:bg-action-faint" />

                            {/* Fill (Selected Range) */}
                            <div
                                className="absolute h-1 top-1/2 -translate-y-1/2 rounded-full bg-action"
                                style={{
                                    left: `${minPercent}%`,
                                    width: `${fillWidth}%`,
                                }}
                            />

                            {/* Thumbs */}
                            {state.values.map((_, i) => (
                                <SliderThumb
                                    key={i}
                                    index={i}
                                    aria-label={thumbLabels?.[i]}
                                    className={clsx(
                                        "size-4 top-1/2 rounded border-2 border-solid border-action bg-surface",
                                        "transition-colors duration-150",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
                                        "active:bg-action-strong hover:bg-action"
                                    )}
                                />
                            ))}
                        </>
                    );
                }}
            </SliderTrack>
            <SliderOutput className="text-xs text-gray-600 mb-2">
                {({ state }) =>
                    state.values
                        .map((_, i) => format(state.getThumbValueLabel(i)))
                        .join(" تا ")
                }
            </SliderOutput>
        </Slider>
    );
}

export default RangeSlider;
