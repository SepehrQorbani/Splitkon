import RepayCardStackItem from "@/components/common/RepayCardStackItem";
import ExpenseCardStackItem from "@/components/common/ExpenseCardStackItem";
import { cn } from "@/utils/cn";
import { FC } from "react";
import { CardStack } from "../../common/CardStack";

const HeroRepayCardStack = ({ className }: { className?: string }) => {
    const cardStackItems = [
        {
            id: 1,
            content: <ExpenseCardStackItem />,
        },
        {
            id: 2,
            content: <RepayCardStackItem />,
        },
        {
            id: 3,
            content: <ExpenseCardStackItem />,
        },
    ];

    return (
        <CardStack
            items={cardStackItems}
            duration={5000}
            offset={4}
            direction="top"
            className={cn("h-[72px] -mt-6", className)}
        />
    );
};

export default HeroRepayCardStack;
