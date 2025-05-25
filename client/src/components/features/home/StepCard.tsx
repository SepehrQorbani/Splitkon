import { Card } from "@/components/common/Card";
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: number * 0.1 }}
            className="w-full relative pe-4 md:pe-0"
        >
            <Card className="h-full p-0 w-full rounded-2xl gap-0">
                <div className="relative w-full">
                    <div className="absolute mx-2 my-2 inset-0 -z-10- [background-size:12px_12px] [background-image:radial-gradient(var(--color-muted-subtle)_1px,transparent_1px)]"></div>
                    <img
                        src={`/images/${image}`}
                        className="p-1 block h-48 w-full object-contain object-top relative"
                        alt=""
                    />
                </div>
                <div className="px-6 py-4 flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">
                        {number}. {title}
                    </h3>
                    <p className="text-muted-soft">{description}</p>
                </div>
                {!isLast && (
                    <>
                        <svg
                            viewBox="0 0 19 194"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-full absolute -z-10 -end-4 top-1/2 block md:hidden stroke-muted-soft"
                        >
                            <path
                                d="M18.0002 193V193C8.86042 193 1.45117 185.591 1.45117 176.451V17.5488C1.45117 8.40917 8.86033 1 18 1V1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="4 4"
                            />
                        </svg>

                        <svg
                            viewBox="0 0 58 194"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="py-8- h-2/3 absolute end-0 -translate-x-3/4 py-4 -z-10 hidden md:block stroke-muted-soft"
                        >
                            <path
                                d="M57 193H52.451C39.1962 193 28.451 182.255 28.451 169V25C28.451 11.7452 17.7058 1 4.45099 1H1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="4 4"
                            />
                        </svg>
                    </>
                )}
            </Card>
        </motion.div>
    );
};
