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
            className={cn("w-full relative md:mb-0", !isLast && "mb-4")}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center relative ms-4">
                    <h3 className="relative text-xl font-semibold px-2 pt-4 shrink-0 z-10 text-shadow-md text-shadow-background">
                        {title}
                    </h3>
                    <div className="absolute text-9xl text-muted-subtle size-32 text-center -bottom-8 -start-8">
                        {number}
                    </div>
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
                    <div className="absolute inset-2 -z-11 [background-size:12px_12px] [background-image:radial-gradient(var(--color-muted-faint)_1px,transparent_1px)]"></div>
                </Card>
            </div>
        </motion.div>
    );
};
