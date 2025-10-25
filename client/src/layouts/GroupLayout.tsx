import { useGetGroup } from "@/api/queries/groups";
import AsyncContent from "@/components/common/AsyncContent";
import { ModalRoot } from "@/components/common/ModalRoot";
import GroupNavbar from "@/components/features/navigation/GroupNavbar";
import GroupSettingMenu from "@/components/features/navigation/GroupSettingMenu";
import { Navbar } from "@/components/features/navigation/Navbar";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore, useMemberStore } from "@/store";
import { useRecentGroupsStore } from "@/store/recentGroups";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect } from "react";
import { NavLink, useLocation, useOutlet, useParams } from "react-router";

const GroupLayout: React.FC = () => {
    const { t } = useTranslations();
    const { token } = useParams<{ token: string }>();
    const location = useLocation();
    const outlet = useOutlet();
    const group = useGroupStore((state) => state.group);
    const setGroup = useGroupStore((state) => state.setGroup);
    const setMembers = useMemberStore((state) => state.setMembers);
    const addRecentGroup = useRecentGroupsStore(
        (state) => state.addRecentGroup
    );
    const { data, isLoading, isFetching, error, refetch } = useGetGroup(
        token as string
    );

    useDocumentTitle(
        isLoading || isFetching
            ? `${t("ui.loading")}...`
            : data
            ? data.data.title
            : ""
    );

    useEffect(() => {
        if (data) {
            const { members, ...groupData } = data.data;
            setGroup(groupData);
            members && setMembers(members);

            addRecentGroup({
                id: groupData.id,
                title: groupData.title,
                edit_token: groupData.edit_token,
                view_token: groupData.view_token,
            });
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
            <GroupNavbar />
            <AsyncContent
                isLoading={isLoading || isFetching}
                error={error}
                refetch={refetch}
                skeleton={groupSkeleton}
            >
                <main className="pt-4 pb-20 px-2 sm:px-4 md:p-4 w-full max-w-7xl mx-auto">
                    {group && (
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="">
                                <h1 className="text-lg md:text-2xl font-bold">
                                    <NavLink to={`${token}`}>
                                        {group.title}
                                    </NavLink>
                                </h1>
                            </div>
                            <div className="flex items-center gap-1">
                                <GroupSettingMenu />
                            </div>
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
            <>
                <ModalRoot />
            </>
        </div>
    );
};
export default GroupLayout;
