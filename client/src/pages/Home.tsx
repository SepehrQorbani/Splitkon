import { useTranslations } from "@/hooks/useTranslations";
import { motion } from "motion/react";
import { Card } from "@/components/common/Card";
import { Button, getButtonStyles } from "@/components/common/Button";
import { Link } from "react-router";
import {
    IconArrowLeft,
    IconArrowRight,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandTelegram,
    IconBuildingBank,
    IconCalculator,
    IconChartBar,
    IconCreditCard,
    IconUsers,
    IconWorld,
} from "@tabler/icons-react";
import { BorderBeam } from "@/components/common/BorderBeam";

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

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl md:text-2xl text-muted-soft max-w-2xl"
                >
                    {t("pages.home.hero.subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-4"
                >
                    <Link
                        to="/new"
                        prefetch="render"
                        className={getButtonStyles({ size: "lg" })}
                    >
                        {/* <Button className="text-lg" size="lg"> */}
                        {t("pages.home.hero.createGroup")}
                        {direction === "rtl" ? (
                            <IconArrowLeft className="size-6 ms-4" />
                        ) : (
                            <IconArrowRight className="size-6 ms-4" />
                        )}
                        {/* </Button> */}
                    </Link>
                    <Button variant="outline" className="text-lg" size="lg">
                        {t("pages.home.hero.howItWorks")}
                    </Button>
                </motion.div>

                {/* <div className="group relative m-0 flex h-72 w-96 rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto sm:max-w-lg">
                    <div className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
                        <img
                            src="/images/dashboard-preview.png"
                            className="animate-fade-in block h-full- w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                            alt=""
                        />
                    </div>
                    <div className="absolute bottom-4 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                        <h1 className="text-2xl font-bold ">Azores</h1>
                        <h1 className="text-sm font-light">
                            A Little Paradise in Portugal
                        </h1>
                    </div>
                </div> */}

                {/* App Preview/Screenshot */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="relative w-full max-w-5xl mt-8"
                >
                    <div className="relative z-10 rounded-xl shadow overflow-hidden border bg-surface/50  p-2 border-surface">
                        <img
                            src="/images/dashboard-preview.png"
                            alt="SplitKon Dashboard Preview"
                            className="w-full h-auto rounded-md"
                        />
                        <BorderBeam
                            duration={5}
                            size={100}
                            className="from-transparent via-brand to-transparent"
                        />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -z-10 inset-0 bg-gradient-to-r from-action/25 to-brand/50 blur-3xl scale-105" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<IconUsers className="w-8 h-8" />}
                        title={t("pages.home.features.cards.createGroup.title")}
                        description={t(
                            "pages.home.features.cards.createGroup.description"
                        )}
                    />
                    <FeatureCard
                        icon={<IconCalculator className="w-8 h-8" />}
                        title={t(
                            "pages.home.features.cards.trackExpenses.title"
                        )}
                        description={t(
                            "pages.home.features.cards.trackExpenses.description"
                        )}
                    />
                    <FeatureCard
                        icon={<IconChartBar className="w-8 h-8" />}
                        title={t("pages.home.features.cards.realtime.title")}
                        description={t(
                            "pages.home.features.cards.realtime.description"
                        )}
                    />
                    <FeatureCard
                        icon={<IconWorld className="w-8 h-8" />}
                        title={t(
                            "pages.home.features.cards.multilingual.title"
                        )}
                        description={t(
                            "pages.home.features.cards.multilingual.description"
                        )}
                    />
                    <FeatureCard
                        icon={<IconCreditCard className="w-8 h-8" />}
                        title={t("pages.home.features.cards.noLogin.title")}
                        description={t(
                            "pages.home.features.cards.noLogin.description"
                        )}
                    />
                    <FeatureCard
                        icon={<IconBuildingBank className="w-8 h-8" />}
                        title={t("pages.home.features.cards.bankInfo.title")}
                        description={t(
                            "pages.home.features.cards.bankInfo.description"
                        )}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard
                        number={1}
                        title={t("pages.home.howItWorks.steps.create.title")}
                        description={t(
                            "pages.home.howItWorks.steps.create.description"
                        )}
                    />
                    <StepCard
                        number={2}
                        title={t("pages.home.howItWorks.steps.track.title")}
                        description={t(
                            "pages.home.howItWorks.steps.track.description"
                        )}
                    />
                    <StepCard
                        number={3}
                        title={t("pages.home.howItWorks.steps.settle.title")}
                        description={t(
                            "pages.home.howItWorks.steps.settle.description"
                        )}
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
                        imageSrc="#"
                        title={t("pages.home.useCases.cards.travelers.title")}
                        description={t(
                            "pages.home.useCases.cards.travelers.description"
                        )}
                    />
                    <UseCaseCard
                        imageSrc="#"
                        title={t("pages.home.useCases.cards.roommates.title")}
                        description={t(
                            "pages.home.useCases.cards.roommates.description"
                        )}
                    />
                    <UseCaseCard
                        imageSrc="#"
                        title={t("pages.home.useCases.cards.events.title")}
                        description={t(
                            "pages.home.useCases.cards.events.description"
                        )}
                    />
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-muted/5 -mx-4 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("pages.home.testimonials.title")}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard
                        text={t("pages.home.testimonials.quotes.traveler.text")}
                        author={t(
                            "pages.home.testimonials.quotes.traveler.author"
                        )}
                        role={t("pages.home.testimonials.quotes.traveler.role")}
                    />
                    <TestimonialCard
                        text={t("pages.home.testimonials.quotes.roommate.text")}
                        author={t(
                            "pages.home.testimonials.quotes.roommate.author"
                        )}
                        role={t("pages.home.testimonials.quotes.roommate.role")}
                    />
                    <TestimonialCard
                        text={t(
                            "pages.home.testimonials.quotes.organizer.text"
                        )}
                        author={t(
                            "pages.home.testimonials.quotes.organizer.author"
                        )}
                        role={t(
                            "pages.home.testimonials.quotes.organizer.role"
                        )}
                    />
                </div>
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

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
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
            <Card className="h-full hover:scale-[102%] transition-transform duration-300">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-lg bg-action/10 text-action">
                        {icon}
                    </div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-muted-soft">{description}</p>
                </div>
            </Card>
        </motion.div>
    );
};

interface StepCardProps {
    number: number;
    title: string;
    description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: number * 0.1 }}
        >
            <Card className="h-full">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-action/10 text-action flex items-center justify-center text-xl font-bold">
                        {number}
                    </div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-muted-soft">{description}</p>
                </div>
            </Card>
        </motion.div>
    );
};

interface UseCaseCardProps {
    imageSrc: string;
    title: string;
    description: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({
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
            <Card className="h-full overflow-hidden hover:scale-[102%] transition-transform duration-300">
                <div className="aspect-video overflow-hidden">
                    <div className="w-full h-full bg-action/10 rounded"></div>
                    {/* <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-full object-cover"
                    /> */}
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-muted-soft">{description}</p>
                </div>
            </Card>
        </motion.div>
    );
};

interface TestimonialCardProps {
    text: string;
    author: string;
    role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    text,
    author,
    role,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Card className="h-full">
                <div className="p-6 flex flex-col gap-4">
                    <p className="text-lg">{text}</p>
                    <div>
                        <p className="font-semibold">{author}</p>
                        <p className="text-sm text-muted-soft">{role}</p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default Home;
