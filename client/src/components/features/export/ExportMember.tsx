import { useDomCapture } from "@/hooks/useDomCapture";
import { useGroupStore } from "@/store";
import { Member } from "@/types";
import { cn } from "@/utils/cn";
import { IconCash, IconMathSymbols, IconTransfer } from "@tabler/icons-react";
import { useState } from "react";
import { Separator } from "react-aria-components";
import { ExportControls } from "./ExportControls";
import { SectionFooter } from "./SectionFooter";
import { SectionFooterCard } from "./SectionFooterCard";
import MemberExpenses from "./member/MemberExpenses";
import MemberExpensesCard from "./member/MemberExpensesCard";
import MemberHeader from "./member/MemberHeader";
import MemberHeaderCard from "./member/MemberHeaderCard";
import MemberPendingBalances from "./member/MemberPendingBalances";
import MemberPendingBalancesCard from "./member/MemberPendingBalancesCard";
import MemberSummary from "./member/MemberSummary";
import MemberSummaryCard from "./member/MemberSummaryCard";

type Props = { member: Member };
type ExportStyle = "table" | "cards";

function ExportMember({ member }: Props) {
    const [exportSection, setExportSection] = useState(["summary", "pending"]);
    const [exportStyle, setExportStyle] = useState<ExportStyle>("table");
    const { targetRef, capture } = useDomCapture({
        filename: "splitkon-members",
        withLogo: false,
        logoOptions: { height: 10, opacity: 0.9, margin: 8 },
    });
    const group = useGroupStore((state) => state.group);
    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const [qrUrl, setQrUrl] = useState(`${baseUrl}/${group?.view_token}`);

    return (
        <div className="relative">
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
                    {
                        id: "pending",
                        icon: <IconTransfer className="size-4" />,
                    },
                    {
                        id: "expenses",
                        icon: <IconCash className="size-4" />,
                    },
                ]}
                qrUrl={qrUrl}
                onQrUrlChange={setQrUrl}
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
                        <MemberHeader group={group} member={member} />
                    ) : (
                        <MemberHeaderCard group={group} member={member} />
                    )}
                    {exportSection.includes("summary") && (
                        <>
                            {exportStyle === "table" ? (
                                <MemberSummary member={member} />
                            ) : (
                                <MemberSummaryCard member={member} />
                            )}
                        </>
                    )}

                    {exportSection.includes("pending") && (
                        <>
                            {exportStyle === "table" ? (
                                <MemberPendingBalances member={member} />
                            ) : (
                                <MemberPendingBalancesCard member={member} />
                            )}
                        </>
                    )}
                    {exportSection.includes("expenses") && (
                        <>
                            {exportStyle === "table" ? (
                                <MemberExpenses member={member} />
                            ) : (
                                <MemberExpensesCard member={member} />
                            )}
                        </>
                    )}
                    {exportStyle === "table" ? (
                        <>
                            <Separator className="border-dashed border-border h-px" />
                            <SectionFooter url={qrUrl} />
                        </>
                    ) : (
                        <SectionFooterCard url={qrUrl} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExportMember;
