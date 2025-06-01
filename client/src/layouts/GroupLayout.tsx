import { getGroup } from "@/api/endpoints/groups";
import AsyncContent from "@/components/common/AsyncContent";
import GroupNavbar from "@/components/features/navigation/GroupNavbar";
import { Navbar } from "@/components/features/navigation/Navbar";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useTranslations } from "@/hooks/useTranslations";
import ActionMenu from "@/pages/group/ActionMenu";
import { useGroupStore, useMemberStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect } from "react";
import { useLocation, useOutlet, useParams } from "react-router";

const GroupLayout: React.FC = () => {
    const { t } = useTranslations();
    const { token } = useParams<{ token: string }>();
    const location = useLocation();
    const outlet = useOutlet();
    const group = useGroupStore((state) => state.group);
    const setGroup = useGroupStore((state) => state.setGroup);
    const setMembers = useMemberStore((state) => state.setMembers);
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["group", token],
        queryFn: () => getGroup(token as string),
    });

    useDocumentTitle(
        isLoading ? `${t("ui.loading")}...` : data ? data.data.title : ""
    );
    useEffect(() => {
        if (data) {
            const { members, ...group } = data.data;
            setGroup(group);
            members && setMembers(members);
        }
    }, [data, setGroup, setMembers, token]);

    const groupSkeleton = (
        <>
            <div className="flex items-center justify-center flex-1">
                <div
                    className="inline-block animate-spin rounded-full border-4 border-t-action border-r-action border-b-border border-l-border size-8"
                    role="status"
                    aria-label="Loading"
                />
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar layout="group" />
            <AsyncContent
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                skeleton={groupSkeleton}
            >
                <GroupNavbar />
                <main className="pt-4 pb-20 px-2 sm:px-4 md:p-4 w-full max-w-7xl mx-auto">
                    {group && (
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="">
                                <h1 className="text-2xl font-bold">
                                    {group.title}
                                </h1>
                            </div>
                            <ActionMenu />
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{ duration: 0.2 }}
                            exit={{
                                opacity: 0,
                                scale: 1.02,
                            }}
                            key={location.pathname}
                        >
                            {outlet}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </AsyncContent>
        </div>
    );
};
export default GroupLayout;
