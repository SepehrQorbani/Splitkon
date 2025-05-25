import {
    IconChartBar,
    IconId,
    IconListDetails,
    IconMathSymbols,
    IconShare,
    IconSquareRoundedPlus,
    IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { AnimatedLine } from "@/components/features/home/AnimatedLine";
import HeroGroupCardStack from "./HeroGroupCardStack";
import HeroRepayCardStack from "./HeroRepayCardStack";

const TRANSITION = {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop" as const,
};
const PATHS = [
    {
        path: "M 1 1 L 1 4 A 8 8 0 0 0 9 12 L 39 12 A 8 8 0 0 1 47 20 L 47 43",
        animate: {
            pathLength: [0, 0.1, 0.1],
            pathOffset: [0, 0, 1],
        },
        transition: {
            ...TRANSITION,
            delay: 3,
            repeatDelay: 3,
        },
    },
    {
        path: "M 1 1 L 1 4 A 8 8 0 0 0 9 12 L 87 12 A 8 8 0 0 1 95 20 L 95 43",
        animate: {
            pathLength: [0, 0.1, 0.1],
            pathOffset: [0, 0, 1],
        },
        transition: {
            ...TRANSITION,
            delay: 6,
            repeatDelay: 3,
        },
    },
    {
        path: "M 1 1 L 1 4 A 8 8 0 0 0 9 12 L 135 12 A 8 8 0 0 1 143 20 L 143 43",
        animate: {
            pathLength: [0, 0.1, 0.1],
            pathOffset: [0, 0, 1],
        },
        transition: {
            ...TRANSITION,
            delay: 4.5,
            repeatDelay: 3,
        },
    },
    {
        path: "M 1 1 L 1 4 A 8 8 0 0 0 9 12 L 183 12 A 8 8 0 0 1 191 20 L 191 43",
        animate: {
            pathLength: [0, 0.1, 0.1],
            pathOffset: [0, 0.2, 1],
        },
        transition: {
            ...TRANSITION,
            duration: 3,
            delay: 5,
            repeatDelay: 3,
            repeatType: "loop" as const,
        },
    },
];

export const Hero = () => {
    return (
        <div
            className="flex justify-center items-center px-4 py-8 relative"
            dir="ltr"
        >
            <div className="flex flex-col justify-center items-center">
                <div className="w-[176px]">
                    <IconSquareRoundedPlus className="size-10 p-2 rounded bg-surface text-action border border-border shadow-md mx-auto" />
                </div>
                <AnimatedLine
                    direction="vertical"
                    width={2}
                    height={40}
                    transition={{ duration: 1 }}
                />
                <HeroGroupCardStack />
            </div>

            <div className="relative mt-6">
                <div className="flex items-center ms-32 relative">
                    <AnimatedLine
                        path="M 1 61 L 1 9 A 8 8 0 0 1 9 1 L 23 1"
                        width={24}
                        height={62}
                        className="relative top-5"
                        transition={{ delay: 6, duration: 1.5 }}
                        animationDir="toStart"
                    />
                    <HeroRepayCardStack />

                    <AnimatedLine
                        path="M 1 1 L 16 1 A 8 8 0 0 1 24 9 L 24 99"
                        width={25}
                        height={100}
                        className="relative top-10"
                        animationDir="toStart"
                        transition={{
                            delay: 4.5,
                            duration: 1.5,
                        }}
                    />
                </div>

                <div className="flex items-center">
                    <AnimatedLine
                        width={96}
                        transition={{ delay: 1, duration: 1.5 }}
                    />
                    {/* Logo */}
                    <div className="w-24 h-24 relative">
                        <motion.div
                            className="bg-surface/50 w-full h-full p-2 border-2 border-surface rounded-xl shadow-center flex items-center justify-center"
                            animate={{
                                scale: [1, 0.9, 0.9, 1, 1],
                                padding: [8, 8, 16, 16, 8],
                                rotate: [0, 0, 180, 180, 0],
                                borderRadius: [
                                    "10%",
                                    "10%",
                                    "20%",
                                    "20%",
                                    "10%",
                                ],
                            }}
                            transition={{
                                duration: 2,
                                ease: "anticipate",
                                times: [0, 0.2, 0.5, 0.8, 1],
                                repeat: Infinity,
                                delay: 1,
                                repeatDelay: 3,
                            }}
                        >
                            <svg
                                width="80"
                                height="80"
                                viewBox="0 0 550 550"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* <rect width="550" height="550" fill="white" /> */}
                                <motion.rect
                                    x="105"
                                    width="340"
                                    height="550"
                                    rx="24"
                                    fill="var(--color-brand)"
                                    animate={{ opacity: [0, 0, 0, 1] }}
                                    transition={{
                                        duration: 1,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        repeatDelay: 1.5,
                                    }}
                                />
                                <motion.path
                                    d="M326.948 30C345.746 30 357.246 50.6307 347.362 66.6197L74.4142 508.153C61.7028 528.716 30 519.708 30 495.534L30 54C30 40.7452 40.7452 30 54 30L326.948 30Z"
                                    fill="var(--color-brand)"
                                    initial={{
                                        y: -30,
                                        x: 76,
                                    }}
                                    animate={{
                                        y: [0, -30],
                                        x: [0, 76],
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: "backInOut",
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        repeatDelay: 1.5,
                                    }}
                                />
                                <motion.path
                                    d="M475.586 41.8466C488.297 21.284 520 30.2921 520 54.4664L520 496C520 509.255 509.255 520 496 520H223.052C204.254 520 192.754 499.369 202.638 483.38L475.586 41.8466Z"
                                    fill="var(--color-brand)"
                                    initial={{
                                        y: 30,
                                        x: -76,
                                    }}
                                    animate={{
                                        y: [0, 30],
                                        x: [0, -76],
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: "backInOut",
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        repeatDelay: 1.5,
                                    }}
                                />
                            </svg>
                        </motion.div>
                        <div className="absolute -z-11 inset-0  bg-radial from-brand to-brand/30 blur-2xl" />
                    </div>
                    <AnimatedLine transition={{ delay: 2.5, duration: 1 }} />
                    <IconMathSymbols className="size-10 p-2 rounded bg-surface text-action border border-border shadow-md mx-auto" />
                    <AnimatedLine transition={{ delay: 3.5, duration: 1 }} />
                    <div>
                        <div className="relative flex items-center">
                            <IconUser className="size-8 p-1 bg-action-subtle text-action shadow-md border-2 border-surface rounded-full" />
                            <IconUser className="size-8 p-1 bg-action-subtle text-action shadow-md border-2 border-surface rounded-full -ms-4" />
                            <IconUser className="size-8 p-1 bg-action-subtle text-action shadow-md border-2 border-surface rounded-full -ms-4" />
                        </div>
                    </div>
                </div>

                <div className="relative start-36 w-56">
                    <svg
                        width="194"
                        height="24"
                        viewBox="0 0 194 24"
                        fill="none"
                        className=""
                        xmlns="http://www.w3.org/2000/svg"
                        strokeWidth={2}
                    >
                        {PATHS.map((config, index) => (
                            <path
                                key={index}
                                d={config.path}
                                stroke="var(--color-surface)"
                                strokeLinejoin="round"
                            />
                        ))}
                        {PATHS.map((config, index) => (
                            <motion.path
                                key={index}
                                d={config.path}
                                stroke="var(--color-brand)"
                                strokeLinejoin="round"
                                animate={config.animate}
                                transition={config.transition}
                            />
                        ))}
                    </svg>
                    <div className="flex items-center justify-between w-48 ms-8">
                        <IconShare className="size-10 p-2 rounded bg-surface text-action border border-border shadow-md" />
                        <IconChartBar className="size-10 p-2 rounded bg-surface text-action border border-border shadow-md" />
                        <IconId className="size-10 p-2 rounded bg-surface text-action border border-border shadow-md" />
                        <IconListDetails className="size-10 p-2 rounded bg-surface text-action border border-border shadow-md" />
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent)] [background-size:16px_16px] [background-image:linear-gradient(to_right,var(--color-muted-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-muted-subtle)_1px,transparent_1px)]"></div>
            {/* <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent)] [background-size:24px_24px] [background-image:radial-gradient(var(--color-muted-soft)_1px,transparent_1px)]"></div> */}
            {/* <div className="absolute -z-13 inset-0  bg-radial from-brand/50 via-blue-500/50 to-brand/0 to-50% blur-3xl scale-70 opacity-70" /> */}
        </div>
    );
};
