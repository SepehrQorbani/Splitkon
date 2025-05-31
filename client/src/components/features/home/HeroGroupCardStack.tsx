import { useTranslations } from "@/hooks/useTranslations";
import {
    IconBeach,
    IconBuildings,
    IconCoffee,
    IconGasStation,
    IconGlassFull,
    IconHome,
    IconMeat,
    IconPaint,
    IconPlant,
    IconReceipt,
    IconTool,
    IconUser,
    IconUsersGroup,
    Icon as TablerIconComponent,
} from "@tabler/icons-react";
import { FC } from "react";
import { CardStack } from "../../common/CardStack";

interface CardStackItem {
    id: number;
    content: React.ReactNode;
}

interface Props {
    data: {
        titleIcon: TablerIconComponent;
        title: string;
        expenseIcon: TablerIconComponent[];
        userCount: number;
    };
}

const UserAvatars: FC<{ count: number }> = ({ count }) => (
    <div className="relative flex items-center">
        {Array.from({ length: count }, (_, i) => (
            <IconUser
                key={i}
                className={`size-7 p-1.5 bg-action-faint border border-border rounded-full ${
                    i > 0 ? "-ms-5" : ""
                }`}
            />
        ))}
    </div>
);

const HeroGroupCard: FC<Props> = ({ data }) => {
    const TitleIcon = data.titleIcon;

    return (
        <div className="bg-surface w-full h-full rounded-xl flex flex-col justify-between p-1.5">
            <div className="flex text-xs gap-1 items-center">
                <TitleIcon className="size-8 p-1 rounded bg-action text-action-fg" />
                <span>{data.title}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
                {data.expenseIcon.map((Icon, i) => (
                    <Icon
                        key={i}
                        className="size-6 p-0.5 text-action bg-action-faint border border-border rounded"
                    />
                ))}
            </div>
            <div className="px-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 101 24"
                >
                    <path
                        stroke="var(--color-border)"
                        strokeDasharray="4 4"
                        strokeLinejoin="round"
                        d="M34 12H7a6 6 0 0 1-6-6V0m33 12h17m-17 0V0m17 12h16m-16 0v12m16-12h27a6 6 0 0 0 6-6V0M67 12V0"
                    ></path>
                </svg>
            </div>
            <div className="mx-auto">
                <UserAvatars count={data.userCount} />
            </div>
        </div>
    );
};

const HeroGroupCardStack: FC = () => {
    const { t } = useTranslations();
    const cardStackItems: CardStackItem[] = [
        {
            id: 1,
            content: (
                <HeroGroupCard
                    data={{
                        titleIcon: IconBeach,
                        title: t("pages.home.hero.sample.travel"),
                        expenseIcon: [
                            IconGasStation,
                            IconCoffee,
                            IconMeat,
                            IconGlassFull,
                        ],
                        userCount: 3,
                    }}
                />
            ),
        },
        {
            id: 2,
            content: (
                <HeroGroupCard
                    data={{
                        titleIcon: IconHome,
                        title: t("pages.home.hero.sample.home"),
                        expenseIcon: [
                            IconGasStation,
                            IconCoffee,
                            IconMeat,
                            IconGlassFull,
                        ],
                        userCount: 2,
                    }}
                />
            ),
        },
        {
            id: 3,
            content: (
                <HeroGroupCard
                    data={{
                        titleIcon: IconUsersGroup,
                        title: t("pages.home.hero.sample.party"),
                        expenseIcon: [
                            IconGasStation,
                            IconCoffee,
                            IconMeat,
                            IconGlassFull,
                        ],
                        userCount: 2,
                    }}
                />
            ),
        },
        {
            id: 4,
            content: (
                <HeroGroupCard
                    data={{
                        titleIcon: IconBuildings,
                        title: t("pages.home.hero.sample.building"),
                        expenseIcon: [
                            IconTool,
                            IconPaint,
                            IconReceipt,
                            IconPlant,
                        ],
                        userCount: 4,
                    }}
                />
            ),
        },
    ];

    return <CardStack items={cardStackItems} duration={8000} />;
};

export default HeroGroupCardStack;
