import { FC } from "react";
import { IconArrowLeft, IconTransfer, IconUser } from "@tabler/icons-react";

const RepayCardStackItem: FC = () => {
    return (
        <div className="bg-surface w-full h-full rounded-lg flex flex-col justify-between p-1.5">
            <div className="flex items-center justify-between px-1">
                <IconTransfer className="size-6 p-0.75" />
                <span className="bg-action-subtle h-1 w-8 rounded me-auto"></span>
                <svg
                    width="33"
                    height="8"
                    viewBox="0 0 33 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-action-soft/75"
                >
                    <rect
                        width="1.6227"
                        height="7.49996"
                        rx="0.811349"
                        fill="currentColor"
                    />
                    <rect
                        x="25"
                        width="1.6227"
                        height="7.49996"
                        rx="0.811349"
                        fill="currentColor"
                    />
                    <rect
                        x="4"
                        width="0.927256"
                        height="7.49996"
                        rx="0.463628"
                        fill="currentColor"
                    />
                    <rect
                        x="29"
                        width="0.927256"
                        height="7.49996"
                        rx="0.463628"
                        fill="currentColor"
                    />
                    <rect
                        x="32"
                        width="0.7"
                        height="7.49996"
                        rx="0.35"
                        fill="currentColor"
                    />
                    <rect
                        x="13"
                        width="0.7"
                        height="7.49996"
                        rx="0.35"
                        fill="currentColor"
                    />
                    <rect
                        x="19"
                        width="0.695442"
                        height="7.49996"
                        rx="0.347721"
                        fill="currentColor"
                    />
                    <rect
                        x="22"
                        width="0.695442"
                        height="7.49996"
                        rx="0.347721"
                        fill="currentColor"
                    />
                    <rect
                        x="10"
                        width="0.7"
                        height="7.49996"
                        rx="0.35"
                        fill="currentColor"
                    />
                    <rect
                        x="7"
                        width="1.15907"
                        height="7.49996"
                        rx="0.579535"
                        fill="currentColor"
                    />
                    <rect
                        x="16"
                        width="1.15907"
                        height="7.49996"
                        rx="0.579535"
                        fill="currentColor"
                    />
                </svg>
            </div>
            <div className="ms-6 flex justify-between items-center">
                <IconUser className="size-4 p-0.5 bg-action-faint border border-border rounded-full" />
                <IconArrowLeft className="size-3 text-action-soft" />
                <IconUser className="size-4 p-0.5 bg-action-faint border border-border rounded-full" />
            </div>
        </div>
    );
};

export default RepayCardStackItem;
