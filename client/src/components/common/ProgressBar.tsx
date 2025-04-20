import { cn } from "@/utils/cn";
import {
    ProgressBar as AriaProgressBar,
    ProgressBarProps as AriaProgressBarProps,
    Label,
} from "react-aria-components";

interface ProgressChartProps extends AriaProgressBarProps {
    label?: string;
    className?: string;
}
function ProgressBar({ label, className, ...props }: ProgressChartProps) {
    return (
        <AriaProgressBar className={cn("text-xs pe-2", className)} {...props}>
            {({ percentage, valueText }) => (
                <>
                    <div className="w-full text-right mb-1.5 relative">
                        {percentage && (
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
                        )}
                        {/* <Label>{label}</Label> */}
                    </div>
                    <div
                        className="h-1.5 box-content relative w-full rounded-full border border-border p-1 flex"
                        dir="ltr"
                    >
                        <div
                            className="rounded-full bg-action/40 border border-action"
                            style={{ width: percentage + "%" }}
                        />
                    </div>
                </>
            )}
        </AriaProgressBar>
    );
}

export default ProgressBar;
