import { Card } from "@/components/common/Card";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";

interface FeatureCardProps {
    image: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    image,
    icon,
    title,
    description,
    className,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn("relative group", className)}
        >
            <div className="absolute z-0 inset-0 bg-gradient-to-r from-blue-500/25 to-brand/50 blur-xl transition duration-300 ease-in-out opacity-10 group-hover:opacity-100" />
            <Card className="h-full  relative overflow-clip rounded-xl shadow bg-background  p-0">
                <div className="rounded-lg border- border-border overflow-clip h-full bg-surface">
                    <div className="relative">
                        <img
                            src={`/images/${image}`}
                            className="block h-80 w-full scale-105 transform object-cover object-top-right transition duration-300 group-hover:scale-100 rotate-2 group-hover:rotate-0"
                            alt=""
                        />
                        <div className="absolute inset-0 w-full bg-surface/30 group-hover:opacity-0"></div>
                    </div>

                    <div className="relative m-0 pb-4 h-full -mt-32 bg-linear-0 from-surface from-80% to-transparent">
                        <div className="relative">
                            <div className="relative px-4 pb-4 transition duration-300 ease-in-out group-hover:-translate-y-2 group-hover:translate-x-3-">
                                <div className="mb-6 ms-2">
                                    <span className="inline-block text-action-fg bg-action rounded-full p-3">
                                        {icon}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4">
                                    {title}
                                </h3>
                                <div className="">
                                    <p className="text-sm font-light text-muted">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
