import { Card } from "@/components/common/Card";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";

interface StepCardProps {
    number: number;
    image: string;
    title: string;
    description: string;
    isLast?: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({
    number,
    image,
    title,
    description,
    isLast = false,
}) => {
    const { direction } = useTranslations();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: number * 0.1 }}
            className="w-full relative"
        >
            <div className="flex flex-col h-full ps-6 md:ps-0">
                {!isLast && (
                    <svg
                        viewBox="0 0 4 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute start-0 -z-10 top-6 pt-6 h-full md:hidden"
                        stroke="var(--color-muted-subtle)"
                        strokeWidth="0.5"
                    >
                        <motion.path
                            d="M0 0.25H4"
                            whileInView={{
                                pathLength: [0, 1],
                                // pathOffset: [, 0],
                            }}
                            transition={{ duration: 0.1 }}
                        />
                        <motion.path
                            d="M2 0V98"
                            whileInView={{
                                pathLength: [0, 1],
                            }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.path
                            d="M0 97 L 2 100"
                            whileInView={{
                                pathLength: [0, 1],
                            }}
                            transition={{ delay: 0.5, duration: 0.1 }}
                        />
                        <motion.path
                            d="M2 100 L 4 97"
                            whileInView={{
                                pathLength: [0, 1],
                            }}
                            transition={{ delay: 0.6, duration: 0.1 }}
                        />
                    </svg>
                )}
                <div className="flex items-center relative -ms-8 md:ms-0">
                    <h3 className="relative text-xl font-semibold px-2 py-4 shrink-0">
                        {number}. {title}
                    </h3>

                    {!isLast && (
                        <>
                            <svg
                                viewBox="0 0 200 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={cn(
                                    "absolute -z-10 ms-4 bottom-2 shrink-0 w-full hidden md:block",
                                    direction === "ltr" && "-scale-x-100"
                                )}
                                stroke="var(--color-muted-subtle)"
                            >
                                <motion.path
                                    d="M81 21.5H200"
                                    whileInView={{
                                        pathLength: [0, 1],
                                        pathOffset: [1, 0],
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.path
                                    d="M3 11.0001C26.5 10.0001 27 15.5772 43.5001 21.5001C60.0002 27.423 68 1.50012 53.5 1.00011C41.5859 0.589281 39.975 21.501 66.5 21.5C70.5 21.4999 74 21.5001 81 21.5001M4.5 14.5001L1.01488 11.7895C0.500134 11.3891 0.500135 10.6112 1.01488 10.2108L4.5 7.50015"
                                    whileInView={{
                                        pathLength: [0, 1],
                                        // pathSpacing: [0.2, 0.4],
                                        pathOffset: [1, 0],
                                    }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                />
                            </svg>
                        </>
                    )}
                </div>
                <Card className="h-full relative z-0 p-0 w-full rounded-2xl gap-0 justify-between overflow-clip">
                    <div className="relative w-full">
                        <img
                            src={`/images/${image}`}
                            className="p-1 block h-48 w-full object-contain object-top relative"
                            alt=""
                        />
                    </div>
                    <div className="relative px-6 py-4 flex flex-col gap-4 h- text-sm text-justify">
                        <p className="text-muted-soft">{description}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-full -z-10 bg-linear-0 from-surface from-70% to-surface/0"></div>
                    </div>
                    <div className="absolute inset-2 -z-11 [background-size:12px_12px] [background-image:radial-gradient(var(--color-muted-subtle)_1px,transparent_1px)]"></div>
                </Card>
            </div>
        </motion.div>
    );
};
