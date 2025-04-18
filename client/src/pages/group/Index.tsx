import { getGroup } from "@/api/endpoints/groups";
import { AsyncContent } from "@/components/common/AsyncContent";
import { Drawer } from "@/components/common/Drawer";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { ExpenseForm } from "@/components/features/expenses/ExpenseForm";
import { GroupHeaderSkeleton } from "@/components/features/group/GroupHeaderSkeleton";
import { TabSkeleton } from "@/components/features/group/TabSkeleton";
import MemberForm from "@/components/features/members/MemberForm";
import { RepaysForm } from "@/components/features/repays/RepayForm";
import ShareForm from "@/components/features/share/ShareForm";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { useMemberStore } from "@/store/members";
import {
    IconCalendar,
    IconCashPlus,
    IconShare,
    IconTransform,
    IconUsersPlus,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { lazy, useEffect } from "react";
import {
    Tabs as AriaTabs,
    Tab,
    TabList,
    TabPanel,
    TabsProps,
} from "react-aria-components";
import { Route, Routes, useLocation, useParams } from "react-router";
import ExpensesIndex from "../expenses/Index";
import MembersIndex from "../members/Index";
import RepaysIndex from "../repays";

const Dashboard = lazy(() => import("./Dashboard"));
// const Home = lazy(() => import("../Home"));
// const About = lazy(() => import("../About"));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-4">
        <span className="text-gray-500">Loading...</span>
    </div>
);
function PersianDate(date: Date) {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}
const GroupIndex = () => {
    const { pathname } = useLocation();
    const { token } = useParams<{ token: string }>();
    const { t } = useTranslations();
    const { setGroup } = useGroupStore();
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
    }, [data, setGroup, setMembers]);

    const group = data?.data;

    const tabHrefs = {
        dashboard: `/${token}`,
        members: `/${token}/members`,
        expenses: `/${token}/expenses`,
        repays: `/${token}/repays`,
    };

    const groupSkeleton = (
        <div className="container flex flex-col gap-4 w-full max-w-7xl mx-auto px-4">
            <GroupHeaderSkeleton />
            <TabSkeleton />
            <DashboardSkeleton />
        </div>
    );

    return (
        <AsyncContent
            isLoading={isLoading}
            error={error}
            loadingMessage={t("ui.loading")}
            errorMessage={t("ui.errorFetchingData")}
            skeleton={groupSkeleton}
        >
            {group && (
                <div className="container flex flex-col gap-4 w-full max-w-7xl mx-auto px-4">
                    <div className="flex items-start justify-between h-12">
                        <div className="flex gap-2">
                            <h1 className="text-2xl font-bold">
                                {group.title}
                            </h1>
                            <div className="flex items-center gap-1">
                                <IconCalendar className="w-4 h-4 text-muted" />
                                <span className="text-xs text-muted">
                                    {PersianDate(new Date(group.date))}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Drawer
                                triggerLabel={<IconShare className="w-4 h-4" />}
                                title="اشتراک گذاری"
                                children={({ close }) => <ShareForm />}
                                buttonProps={{ intent: "neutral" }}
                            />
                            <Drawer
                                triggerLabel={
                                    <IconUsersPlus className="w-4 h-4" />
                                }
                                title="افزودن اعضا"
                                children={({ close }) => (
                                    <MemberForm onSubmitSuccess={close} />
                                )}
                                buttonProps={{ intent: "neutral" }}
                            />
                            <Drawer
                                triggerLabel={
                                    <IconTransform className="w-4 h-4" />
                                }
                                title="بازپرداخت"
                                children={({ close }) => (
                                    <RepaysForm onSubmitSuccess={close} />
                                )}
                                buttonProps={{ intent: "neutral" }}
                            />
                            <Drawer
                                triggerLabel={
                                    <>
                                        {/* <IconTransactionDollar className="w-4 h-4" />
                                <IconCashBanknotePlus className="w-4 h-4" /> */}
                                        <IconCashPlus className="w-4 h-4" />
                                        <span className="hidden md:inline">
                                            {t("ui.newExpense")}
                                        </span>
                                    </>
                                }
                                title="هزینه جدید"
                                children={({ close }) => (
                                    <ExpenseForm onSubmitSuccess={close} />
                                )}
                            />
                        </div>
                    </div>
                    <AriaTabs
                        selectedKey={pathname}
                        className="flex flex-col gap-4 mb-8"
                        {...({ "aria-label": "Navigation Tabs" } as TabsProps)}
                    >
                        <TabList className="flex gap-2 border-b border-border">
                            <Tab
                                id={tabHrefs.dashboard}
                                href={tabHrefs.dashboard}
                                className={({ isSelected }) =>
                                    `px-4 py-2 cursor-pointer ${
                                        isSelected
                                            ? "border-b-2 border-action text-action font-semibold"
                                            : "text-muted"
                                    }`
                                }
                            >
                                {t("dashboard")}
                            </Tab>
                            <Tab
                                id={tabHrefs.members}
                                href={tabHrefs.members}
                                className={({ isSelected }) =>
                                    `px-4 py-2 cursor-pointer ${
                                        isSelected
                                            ? "border-b-2 border-action text-action font-semibold"
                                            : "text-muted"
                                    }`
                                }
                            >
                                {t("members")}
                            </Tab>
                            <Tab
                                id={tabHrefs.expenses}
                                href={tabHrefs.expenses}
                                className={({ isSelected }) =>
                                    `px-4 py-2 cursor-pointer ${
                                        isSelected
                                            ? "border-b-2 border-action text-action font-semibold"
                                            : "text-muted"
                                    }`
                                }
                            >
                                {t("expenses")}
                            </Tab>
                            <Tab
                                id={tabHrefs.repays}
                                href={tabHrefs.repays}
                                className={({ isSelected }) =>
                                    `px-4 py-2 cursor-pointer ${
                                        isSelected
                                            ? "border-b-2 border-action text-action font-semibold"
                                            : "text-muted"
                                    }`
                                }
                            >
                                {t("repays")}
                            </Tab>
                        </TabList>
                        <TabPanel id={pathname}>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route
                                    path="members"
                                    element={<MembersIndex />}
                                />
                                <Route
                                    path="expenses"
                                    element={<ExpensesIndex />}
                                />
                                <Route
                                    path="repays"
                                    element={<RepaysIndex />}
                                />
                            </Routes>
                        </TabPanel>
                    </AriaTabs>
                </div>
            )}
        </AsyncContent>
    );
};

export default GroupIndex;
