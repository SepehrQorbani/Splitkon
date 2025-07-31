import { getButtonStyles } from "@/components/common/Button";
import { SOCIAL_LINKS } from "@/constants/links";
import { useTranslations } from "@/hooks/useTranslations";
import { IconBrandGithub, IconMessages } from "@tabler/icons-react";
import { motion } from "framer-motion";

const About = () => {
    const { t } = useTranslations();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80">
            <motion.h1
                id="about-title"
                className="max-w-4xl mx-auto text-start text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground"
                variants={itemVariants}
            >
                {t("pages.about.title")} {t("appName")}
            </motion.h1>
            <motion.div
                className="max-w-4xl mx-auto text-justify bg-surface p-8 rounded-xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                role="region"
                aria-labelledby="about-title"
            >
                <motion.p
                    className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
                    variants={itemVariants}
                >
                    {t("pages.about.intro")}
                </motion.p>
                <motion.p
                    className="text-base sm:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
                    variants={itemVariants}
                >
                    {t("pages.about.usage_scenarios")}
                </motion.p>

                <motion.p
                    className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
                    variants={itemVariants}
                >
                    {t("pages.about.mission")}
                </motion.p>

                <motion.p
                    className="text-lg sm:text-xl font-semibold text-foreground mb-8"
                    variants={itemVariants}
                >
                    {t("pages.about.cta")}
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    variants={itemVariants}
                >
                    <a
                        href={SOCIAL_LINKS.github}
                        className={getButtonStyles({
                            size: "lg",
                            intent: "neutral",
                            className:
                                "rounded-xl py-3 bg-surface/50 border-surface text-sm hover:bg-surface/80",
                        })}
                    >
                        <IconBrandGithub className="size-8 rounded-full p-2 bg-action me-2 shadow text-action-fg" />
                        {t("pages.home.contribution.github")}
                    </a>
                    <a
                        href={SOCIAL_LINKS.telegram}
                        className={getButtonStyles({
                            size: "lg",
                            intent: "neutral",
                            className:
                                "rounded-xl py-3 bg-surface/50 border-surface text-sm hover:bg-surface/80",
                        })}
                    >
                        <IconMessages className="size-8 rounded-full p-2 bg-action me-2 shadow text-action-fg" />
                        {t("pages.home.contribution.feedback")}
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default About;
