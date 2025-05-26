import { motion } from "motion/react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/common/Button";
import { IconBrandGithub, IconMessages } from "@tabler/icons-react";

const About = () => {
    const { t } = useTranslations();

    return (
        <section className="py-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {t("pages.about.title")}
                </h1>
                <motion.p
                    className="text-xl text-muted-soft max-w-2xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {t("pages.about.description")}
                </motion.p>
                <motion.div
                    className="flex flex-col md:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
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
                </motion.div>
            </motion.div>
        </section>
    );
};

export default About;
