import { getGroup } from "@/api/endpoints/groups";
import { AsyncContent } from "@/components/common/AsyncContent";
import { GroupHeaderSkeleton } from "@/components/features/group/GroupHeaderSkeleton";
import GroupNavbar from "@/components/features/navigation/GroupNavbar";
import { Navbar } from "@/components/features/navigation/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import ActionMenu from "@/pages/group/ActionMenu";
import { useGroupStore, useMemberStore } from "@/store";
import { IconCalendar } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router";

const GroupLayout: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const { t, formatDate } = useTranslations();

    const setGroup = useGroupStore((state) => state.setGroup);
    const setMembers = useMemberStore((state) => state.setMembers);
    const { data, isLoading, error } = useQuery({
        queryKey: ["group", token],
        queryFn: () => getGroup(token as string),
    });
    useEffect(() => {
        if (data) {
            const { members, ...group } = data.data;
            setGroup(group);
            members && setMembers(members);
        }
    }, [data, setGroup, setMembers, token]);
    const group = data?.data;

    const groupSkeleton = (
        <div>
            <GroupHeaderSkeleton />
        </div>
    );

    return (
        <div className="min-h-screen">
            <Navbar />
            <GroupNavbar />
            <main className="pt-4 pb-16 px-2 sm:px-4 md:p-4 container mx-auto">
                <AsyncContent
                    isLoading={isLoading}
                    error={error}
                    loadingMessage={t("ui.loading")}
                    errorMessage={t("ui.errorFetchingData")}
                    skeleton={groupSkeleton}
                >
                    <div className="flex items-start justify-between h-12">
                        {group && (
                            <div className="flex gap-2">
                                <h1 className="text-2xl font-bold">
                                    {group.title}
                                </h1>
                                <div className="flex items-center gap-1">
                                    <IconCalendar className="w-4 h-4 text-muted" />
                                    <span className="text-xs text-muted">
                                        {formatDate(new Date(group.date))}
                                    </span>
                                </div>
                            </div>
                        )}
                        <ActionMenu />
                    </div>
                </AsyncContent>
                <Outlet />
            </main>
        </div>
    );
};
export default GroupLayout;
