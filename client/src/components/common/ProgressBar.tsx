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
        <AriaProgressBar className={cn("text-xs", className)} {...props}>
            {({ percentage, valueText }) => (
                <>
                    <div className="flex justify-between">
                        <span>{valueText}</span>
                        <Label>{label}</Label>
                    </div>
                    <div
                        className="h-2 relative w-full rounded border border-border py-1 px-0.5 flex items-center"
                        dir="ltr"
                    >
                        <div
                            className="h-1 rounded-full bg-action"
                            style={{ width: percentage + "%" }}
                        />
                    </div>
                </>
            )}
        </AriaProgressBar>
    );
}

export default ProgressBar;
