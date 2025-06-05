import { cn } from "@/utils/cn";
import {
    ProgressBar as AriaProgressBar,
    ProgressBarProps as AriaProgressBarProps,
    Label,
} from "react-aria-components";

interface ProgressChartProps extends AriaProgressBarProps {
    label?: string;
    color?:
        | "action"
        | "error"
        | "success"
        | "warning"
        | "settled"
        | "creditor"
        | "debtor";
    className?: string;
    remainFlag?: boolean;
    remainColor?:
        | "action"
        | "error"
        | "success"
        | "warning"
        | "settled"
        | "creditor"
        | "debtor";
    percentageMode?: "plain" | "tooltip";
}
function ProgressBar({
    label,
    color = "action",
    className,
    remainFlag = false,
    percentageMode = "tooltip",
    remainColor = "action",
    ...props
}: ProgressChartProps) {
    return (
        <AriaProgressBar
            className={cn("text-[10px] pe-2", className)}
            {...props}
        >
            {({ percentage, valueText }) => (
                <>
                    <div
                        className={cn(
                            "w-full text-right relative",
                            percentageMode === "tooltip" && "mb-1.5"
                        )}
                    >
                        {percentage !== undefined &&
                        percentageMode === "tooltip" ? (
                            <div className="-me-2">
                                <span
                                    className="bg-action text-action-fg px-1 rounded-sm relative z-1 shadow"
                                    dir="ltr"
                                    style={{
                                        marginRight: 100 - percentage + "%",
                                    }}
                                >
                                    <span className="w-3 h-3 absolute -bottom-3 right-0">
                                        <svg
                                            width={8}
                                            height={8}
                                            viewBox="0 0 12 12"
                                            className="fill-action"
                                        >
                                            <path d="M0 0 L6 6 L12 0" />
                                        </svg>
                                    </span>
                                    {valueText}
                                </span>
                            </div>
                        ) : (
                            <div className="flex justify-between ms-2">
                                <span>{valueText}</span>
                                <Label>{label}</Label>
                            </div>
                        )}
                    </div>
                    <div
                        className="h-1.5 box-content relative w-full rounded-full border border-border p-1 flex gap-1"
                        dir="ltr"
                    >
                        <div
                            className={`rounded-full border bg-${color}-subtle border-${color}`}
                            style={{ width: percentage + "%" }}
                        />
                        {remainFlag &&
                            percentage !== undefined &&
                            percentage !== 100 && (
                                <div
                                    className={`rounded-full border bg-${remainColor}-subtle border-${remainColor}`}
                                    style={{ width: 100 - percentage + "%" }}
                                />
                            )}
                    </div>
                </>
            )}
        </AriaProgressBar>
    );
}

export default ProgressBar;
