import { Card } from "@/components/common/Card";
import { motion } from "motion/react";

interface UseCaseCardProps {
    imageSrc: string;
    title: string;
    description: string;
}

export const UseCaseCard: React.FC<UseCaseCardProps> = ({
    imageSrc,
    title,
    description,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Card className="h-full rounded-2xl overflow-hidden hover:scale-[102%] transition-transform duration-300 gap-0">
                <div>
                    <img
                        src={`./images/${imageSrc}`}
                        alt=""
                        className="rounded-xl w-full"
                    />
                </div>
                <div className="px-4 py-4 h-full">
                    <h3 className="text-xl text-action font-semibold mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-justify text-muted-soft">
                        {description}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
};
