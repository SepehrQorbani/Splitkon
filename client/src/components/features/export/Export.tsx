import { useGetSummary } from "@/api/queries/summary";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { useDomCapture } from "@/hooks/useDomCapture";
import { useGroupStore, useMemberStore } from "@/store";
import { Summary } from "@/types/schemas/summary";
import { cn } from "@/utils/cn";
import { IconMathSymbols, IconTransfer, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Separator } from "react-aria-components";
import { useParams } from "react-router";
import { ExportControls } from "./ExportControls";
import { SectionFooter } from "./SectionFooter";
import { SectionFooterCard } from "./SectionFooterCard";
import { SectionHeader } from "./SectionHeader";
import { SectionHeaderCard } from "./SectionHeaderCard";
import { GroupMembers } from "./group/GroupMembers";
import { GroupMembersCard } from "./group/GroupMembersCard";
import { GroupPendingBalances } from "./group/GroupPendingBalances";
import { GroupPendingBalancesCard } from "./group/GroupPendingBalancesCard";
import { GroupSummary } from "./group/GroupSummary";
import { GroupSummaryCard } from "./group/GroupSummaryCard";

type ExportStyle = "table" | "cards";

function Export() {
    const [exportSection, setExportSection] = useState([
        "summary",
        "users",
        "repays",
    ]);
    const [exportStyle, setExportStyle] = useState<ExportStyle>("table");
    const { targetRef, capture } = useDomCapture({
        filename: "splitkon-members",
        withLogo: false,
        logoOptions: { height: 10, opacity: 0.9, margin: 8 },
    });
    const { token } = useParams();
    const group = useGroupStore((state) => state.group);
    const members = useMemberStore((state) => state.members);
    const [summary, setSummary] = useState<Summary | null>(null);

    const {
        data: summaryData,
        isPending,
        error,
    } = useGetSummary(token as string);

    useEffect(() => {
        if (summaryData) {
            setSummary(summaryData.summary);
        }
    }, [summaryData]);
    return isPending && !error ? (
        <div className="flex items-center justify-center flex-1 p-12">
            <LoadingIndicator size="sm" />
        </div>
    ) : (
        <div>
            <ExportControls
                exportSection={exportSection}
                onSectionChange={setExportSection}
                onCapture={capture}
                exportStyle={exportStyle}
                onStyleChange={setExportStyle}
                sections={[
                    {
                        id: "summary",
                        icon: <IconMathSymbols className="size-4" />,
                    },
                    { id: "users", icon: <IconUsers className="size-4" /> },
                    {
                        id: "repays",
                        icon: <IconTransfer className="size-4" />,
                    },
                ]}
            />
            <div
                ref={targetRef}
                className="pb-1 bg-surface pt-1 overflow-auto min-w-max"
            >
                <div
                    className={cn(
                        "border border-border m-2",
                        exportStyle === "table"
                            ? "rounded"
                            : "rounded-xl p-4 space-y-6"
                    )}
                >
                    {exportStyle === "table" ? (
                        <SectionHeader group={group} />
                    ) : (
                        <SectionHeaderCard group={group} />
                    )}
                    {exportSection.includes("summary") && (
                        <>
                            {exportStyle === "table" ? (
                                <GroupSummary summary={summary} />
                            ) : (
                                <GroupSummaryCard summary={summary} />
                            )}
                        </>
                    )}

                    {exportSection.includes("users") && (
                        <>
                            {exportStyle === "table" ? (
                                <GroupMembers members={members} />
                            ) : (
                                <GroupMembersCard members={members} />
                            )}
                        </>
                    )}
                    {exportSection.includes("repays") && (
                        <>
                            {exportStyle === "table" ? (
                                <GroupPendingBalances summary={summary} />
                            ) : (
                                <GroupPendingBalancesCard summary={summary} />
                            )}
                        </>
                    )}
                    {exportStyle === "table" ? (
                        <>
                            <Separator className="border-dashed border-border h-px" />
                            <SectionFooter group={group} />
                        </>
                    ) : (
                        <SectionFooterCard group={group} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Export;
