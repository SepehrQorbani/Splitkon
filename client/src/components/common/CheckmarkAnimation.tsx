import { motion } from "motion/react";

const cardinalVariants = {
    hidden: { pathLength: 0, pathOffset: 0 },
    visible: {
        pathLength: 1,
        pathOffset: 1,
        transition: {
            delay: 1,
            duration: 0.4,
            type: "spring",
            bounce: 0,
        },
    },
};

const diagonalVariants = {
    hidden: { pathLength: 0, pathOffset: 0 },
    visible: {
        pathLength: 1,
        pathOffset: 1,
        transition: {
            delay: 0.8,
            duration: 0.5,
            type: "spring",
            bounce: 0,
        },
    },
};

const outerRectVariants = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: {
            delay: 1,
            type: "spring",
            duration: 1.5,
            bounce: 0.5,
        },
    },
};

const innerRectVariants = {
    hidden: { scale: 0, rx: 16 },
    visible: {
        scale: 1,
        rx: 4,
        transition: {
            type: "spring",
            duration: 1.5,
            bounce: 0.5,
            rx: { delay: 1.2 },
        },
    },
};

const checkmarkVariants = {
    hidden: { opacity: 0, pathLength: 0, pathOffset: 0 },
    visible: {
        opacity: 1,
        pathLength: 1,
        pathOffset: 0,
        transition: {
            opacity: { delay: 0.5, duration: 0.01 },
            pathLength: {
                delay: 0.5,
                type: "spring",
                duration: 1,
                bounce: 0,
            },
        },
    },
};

const CheckmarkAnimation = ({ size = 60, strokeWidth = 2 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ strokeWidth }}
        >
            <motion.path
                d="M25 25V1"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={cardinalVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.path
                d="M25 24.9707L1 24.9707"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={cardinalVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.path
                d="M24.9707 24.9707L24.9707 48.9707"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={cardinalVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.path
                d="M24.9707 25L48.9707 25"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={cardinalVariants}
                initial="hidden"
                animate="visible"
            />

            <motion.path
                d="M25 24.6274L47.6274 2"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={diagonalVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.path
                d="M24.6274 24.6274L2 2"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={diagonalVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.path
                d="M24.6274 25L2 47.6274"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={diagonalVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.path
                d="M25 25L47.6274 47.6274"
                stroke="var(--color-action)"
                strokeLinecap="round"
                variants={diagonalVariants}
                initial="hidden"
                animate="visible"
            />

            <motion.rect
                x="3"
                y="3"
                width="44"
                height="44"
                rx="6"
                fill="var(--color-action-soft)"
                style={{ transformOrigin: "center", opacity: 0.2 }}
                variants={outerRectVariants}
                initial="hidden"
                animate="visible"
            />

            <motion.rect
                x="8.94141"
                y="8.93604"
                width="32"
                height="32"
                fill="var(--color-action)"
                style={{ transformOrigin: "center" }}
                variants={innerRectVariants}
                initial="hidden"
                animate="visible"
            />

            <motion.path
                d="M17.9414 24.936L22.9414 29.936L32.9414 19.936"
                stroke="var(--color-action-fg)"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkmarkVariants}
                initial="hidden"
                animate="visible"
            />
        </svg>
    );
};

export default CheckmarkAnimation;
