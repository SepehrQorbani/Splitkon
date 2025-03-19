// client/src/pages/Home.tsx
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuthStore, useUIStore } from "@/store";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import {
    Dialog,
    DialogTrigger,
    Heading,
    Modal,
    ModalOverlay,
    OverlayArrow,
    Popover,
} from "react-aria-components";
import { Link } from "react-router";
import { LoadingWrapper } from "@/components/ui/LoadingWrapper";

const Home: React.FC = () => {
    const { isAuthenticated, login, logout } = useAuthStore();
    const language = useUIStore((state) => state.language);
    const { t } = useTranslations();
    const { data, isLoading } = useQuery({
        queryKey: ["homeData", language],
        queryFn: fetchData,
    });

    return (
        <LoadingWrapper t={t} isLoading={isLoading}>
            <div className="p-4 h-[200vh] flex flex-col justify-between">
                <div>
                    <header className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-brand">
                            {t("homeTitle")}
                        </h1>
                        <nav className="mt-4">
                            <Link
                                to="/about"
                                className="text-link hover:text-link-strong"
                            >
                                {t("goToAbout")}
                            </Link>
                        </nav>
                    </header>
                    <p className="mt-2 text-subtle">
                        {t("authenticated")}:{" "}
                        <span className="font-semibold">
                            {isAuthenticated ? t("yes") : t("no")}
                        </span>
                    </p>
                    <div className="mt-4 space-x-4">
                        <Button
                            onPress={login}
                            variant="solid"
                            intent="primary"
                            isDisabled={isAuthenticated}
                        >
                            {t("login")}
                        </Button>
                        <DialogTrigger>
                            <Button
                                variant="outline"
                                intent="danger"
                                isDisabled={!isAuthenticated}
                            >
                                {t("logout")}
                            </Button>
                            <ModalOverlay
                                isDismissable={true}
                                className={({ isEntering, isExiting }) =>
                                    `fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur-[2px]`
                                }
                            >
                                <Modal
                                    className={({ isEntering, isExiting }) => `
                            w-full max-w-md overflow-hidden rounded bg-white p-6 shadow-xl
                          `}
                                >
                                    <Dialog className="p-4 bg-surface text-text rounded">
                                        {({ close }) => (
                                            <>
                                                <p>{t("confirmLogout")}</p>
                                                <Button
                                                    onPress={() => {
                                                        logout();
                                                        close();
                                                    }}
                                                    className="mt-2 bg-error text-error-fg px-4 py-2 rounded"
                                                >
                                                    {t("yes")}
                                                </Button>
                                                <Button
                                                    onPress={close}
                                                    className="mt-2 ml-2 bg-action text-action-fg px-4 py-2 rounded"
                                                >
                                                    {t("no")}
                                                </Button>
                                            </>
                                        )}
                                    </Dialog>
                                </Modal>
                            </ModalOverlay>
                        </DialogTrigger>
                        <DialogTrigger>
                            <Button aria-label="Help">ⓘ</Button>
                            <Popover
                                placement="top"
                                className={({ isEntering, isExiting }) => `
                    w-[280px] placement-bottom:mt-0 placement-left:mr-1 placement-right:ml-1 placement-top:mb-0 group bg-action-fg border border-border p-4 rounded shadow"
                                  `}
                            >
                                <OverlayArrow>
                                    <svg
                                        viewBox="0 0 12 12"
                                        className="block fill-action-fg stroke-1 stroke-border group-data-[placement=bottom]:rotate-180
                                group-data-[placement=left]:rotate-270
                                group-data-[placement=right]:rotate-90
                    
                                w-4 h-4"
                                    >
                                        <path d="M0 0L6 6L12 0" />
                                    </svg>
                                </OverlayArrow>
                                <Dialog>
                                    <Heading slot="title">Help</Heading>
                                    <p className="px-4 py-2 bg-info-subtle text-info-strong border border-info rounded">
                                        Info: Loading in progress...
                                    </p>
                                </Dialog>
                            </Popover>
                        </DialogTrigger>
                    </div>
                    <p className="mt-4 text">{data?.message}</p>
                </div>
                <div className="">sdfsf</div>
            </div>
        </LoadingWrapper>
    );
};

export default Home;
