import { Button, getButtonStyles } from "@/components/common/Button";
import { FlipWords } from "@/components/common/FLipWords";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandTelegram,
    IconChevronLeft,
    IconChevronRight,
    IconDashboard,
    IconMathSymbols,
    IconMessages,
    IconPlayerPlay,
    IconShare,
    IconSquareRoundedPlus,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { FeatureCard } from "../components/features/home/FeatureCard";
import { Hero } from "../components/features/home/Hero";
import { UseCaseCard } from "../components/features/home/UseCaseCard";
import { StepCard } from "../components/features/home/StepCard";

const Home: React.FC = () => {
    const { t, direction } = useTranslations();

    return (
        <div className="container mx-auto max-w-7xl px-4 space-y-24">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-[90vh] flex flex-col items-center justify-center text-center gap-8 py-20"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl md:text-6xl font-bold"
                >
                    {t("pages.home.hero.title")}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl md:text-2xl text-muted-soft max-w-2xl"
                >
                    {t("pages.home.hero.subtitle")}
                    <FlipWords
                        words={t("pages.home.hero.flipWords").split(",")}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-4 z-10"
                >
                    <Link
                        to="/new"
                        prefetch="render"
                        className={getButtonStyles({
                            size: "lg",
                            intent: "neutral",
                            className:
                                "rounded-xl py-6 bg-surface/20 hover:bg-surface/60 border-surface text-sm",
                        })}
                    >
                        <span className="rounded-full p-2 bg-action me-2 shadow">
                            <IconSquareRoundedPlus className="size-4 text-action-fg" />
                        </span>
                        {t("pages.home.hero.createGroup")}
                        {direction === "rtl" ? (
                            <IconChevronLeft className="size-4 ms-8" />
                        ) : (
                            <IconChevronRight className="size-4 ms-8" />
                        )}
                    </Link>
                    <Button
                        size="lg"
                        intent="neutral"
                        className="rounded-xl py-6 bg-surface/20 border-surface text-sm hover:bg-surface/60"
                    >
                        <span className="rounded-full p-2 bg-surface shadow">
                            <IconPlayerPlay className="size-4 text-action" />
                        </span>
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="relative w-full max-w-5xl mt-8"
                >
                    <Hero />
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section className="py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("pages.home.features.title")}
                    </h2>
                    <p className="text-xl text-muted-soft">
                        {t("pages.home.features.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 -lg:grid-cols-3 gap-8">
                    <FeatureCard
                        image="new-group.png"
                        icon={<IconSquareRoundedPlus className="size-6" />}
                        title={t("pages.home.features.cards.startEasy.title")}
                        description={t(
                            "pages.home.features.cards.startEasy.description"
                        )}
                        className="md:col-span-7"
                    />
                    <FeatureCard
                        image="expenses.png"
                        icon={<IconMathSymbols className="size-6" />}
                        title={t("pages.home.features.cards.splitFairly.title")}
                        description={t(
                            "pages.home.features.cards.splitFairly.description"
                        )}
                        className="md:col-span-5"
                    />
                    <FeatureCard
                        image="dashboard.png"
                        icon={<IconDashboard className="size-6" />}
                        title={t(
                            "pages.home.features.cards.monitorSmart.title"
                        )}
                        description={t(
                            "pages.home.features.cards.monitorSmart.description"
                        )}
                        className="md:col-span-5"
                    />
                    <FeatureCard
                        image="share.png"
                        icon={<IconShare className="size-6" />}
                        title={t("pages.home.features.cards.shareEasy.title")}
                        description={t(
                            "pages.home.features.cards.shareEasy.description"
                        )}
                        className="md:col-span-7"
                    />
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("pages.home.howItWorks.title")}
                    </h2>
                    <p className="text-xl text-muted-soft">
                        {t("pages.home.howItWorks.subtitle")}
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8">
                    <StepCard
                        number={1}
                        image="step-01.svg"
                        title={t("pages.home.howItWorks.steps.create.title")}
                        description={t(
                            "pages.home.howItWorks.steps.create.description"
                        )}
                    />
                    <StepCard
                        number={2}
                        image="step-02.svg"
                        title={t("pages.home.howItWorks.steps.track.title")}
                        description={t(
                            "pages.home.howItWorks.steps.track.description"
                        )}
                    />
                    <StepCard
                        number={3}
                        image="step-03.svg"
                        title={t("pages.home.howItWorks.steps.settle.title")}
                        description={t(
                            "pages.home.howItWorks.steps.settle.description"
                        )}
                        isLast={true}
                    />
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("pages.home.useCases.title")}
                    </h2>
                    <p className="text-xl text-muted-soft">
                        {t("pages.home.useCases.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <UseCaseCard
                        imageSrc="case-01.png"
                        title={t("pages.home.useCases.cards.travelers.title")}
                        description={t(
                            "pages.home.useCases.cards.travelers.description"
                        )}
                    />
                    <UseCaseCard
                        imageSrc="case-02.png"
                        title={t("pages.home.useCases.cards.roommates.title")}
                        description={t(
                            "pages.home.useCases.cards.roommates.description"
                        )}
                    />
                    <UseCaseCard
                        imageSrc="case-03.png"
                        title={t("pages.home.useCases.cards.building.title")}
                        description={t(
                            "pages.home.useCases.cards.building.description"
                        )}
                    />
                </div>
            </section>

            {/* Contribution & Feedback Section */}
            <section className="py-20 text-center relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("pages.home.contribution.title")}
                    </h2>
                    <p className="text-xl text-muted-soft max-w-2xl mx-auto mb-8">
                        {t("pages.home.contribution.description")}
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button
                            intent="neutral"
                            className="rounded-xl py-3 bg-surface/20 border-surface text-sm hover:bg-surface/60"
                        >
                            <IconBrandGithub className="size-8 rounded-full p-2 bg-action me-2 shadow text-action-fg" />
                            {t("pages.home.contribution.github")}
                        </Button>
                        <Button
                            intent="neutral"
                            className="rounded-xl py-3 bg-surface/20 border-surface text-sm hover:bg-surface/60"
                        >
                            <IconMessages className="size-8 rounded-full p-2 bg-action me-2 shadow text-action-fg" />
                            {t("pages.home.contribution.feedback")}
                        </Button>
                    </div>
                </motion.div>

                <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent)] [background-size:16px_16px] [background-image:linear-gradient(to_right,var(--color-muted-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-muted-subtle)_1px,transparent_1px)]"></div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">SplitKon</h3>
                        <p className="text-muted-soft">
                            {t("pages.home.footer.description")}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">
                            {t("pages.home.footer.usefulLinks")}
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-muted-soft hover:text-action"
                                >
                                    {t("pages.about.title")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-muted-soft hover:text-action"
                                >
                                    {t("pages.home.footer.contact")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">
                            {t("pages.home.footer.socialMedia")}
                        </h4>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="text-muted-soft hover:text-action"
                            >
                                <IconBrandGithub className="w-6 h-6" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-soft hover:text-action"
                            >
                                <IconBrandInstagram className="w-6 h-6" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-soft hover:text-action"
                            >
                                <IconBrandTelegram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                    <div className="text-sm text-muted-soft">
                        © {new Date().getFullYear()} SplitKon.{" "}
                        {t("pages.home.footer.copyright")}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
