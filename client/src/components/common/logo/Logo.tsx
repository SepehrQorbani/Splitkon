import React from "react";

type Props = {
    width?: number;
    height?: number;
    className?: string;
};

function Logo({ width, height, className }: Props) {
    return (
        <svg
            width={width ? `${width}px` : "100%"}
            height={height ? `${height}px` : "100%"}
            className={className}
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
        >
            <path d="M301.948 5.00001C320.746 5.00001 332.246 25.6307 322.362 41.6197L49.4142 483.153C36.7028 503.716 5 494.708 5 470.534L5.00002 29C5.00002 15.7452 15.7452 5 29 5L301.948 5.00001Z" />
            <path d="M450.586 16.8466C463.297 -3.71597 495 5.29207 495 29.4664L495 471C495 484.255 484.255 495 471 495H198.052C179.254 495 167.754 474.369 177.638 458.38L450.586 16.8466Z" />
        </svg>
    );
}

export default Logo;
