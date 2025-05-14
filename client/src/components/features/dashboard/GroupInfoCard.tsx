import { Card } from "@/components/common/Card";
import {
    IconCalendarBolt,
    IconCalendarPause,
    IconScript,
} from "@tabler/icons-react";
import { cn } from "@/utils/cn";
import { FC } from "react";
import { Group } from "@/types/schemas/group";
import { useTranslations } from "@/hooks/useTranslations";
import { diffInDays } from "@/utils/date";

interface GroupInfoCardProps {
    group: Group | null;
    className?: string;
}

export const GroupInfoCard: FC<GroupInfoCardProps> = ({ group, className }) => {
    const { t, formatDate, formatDaysToWords } = useTranslations();
    return (
        <Card className={cn(className)}>
            <div className="">
                <div className="flex justify-between gap-2">
                    <div className="flex flex-col items-center justify-center">
                        <IconCalendarBolt className="size-6 text-action p-1 rounded" />
                    </div>
                    <div className="w-full border-t mt-3 border-action-soft border-dashed"></div>
                    <div className="shrink-0 text-[10px] flex items-center">
                        {formatDaysToWords(
                            diffInDays(group?.date, group?.closing_date),
                            false
                        )}
                    </div>
                    <div className="w-full border-t mt-3 border-action-soft border-dashed"></div>
                    <div className="flex flex-col items-center justify-center">
                        <IconCalendarPause className="size-6 text-action p-1 rounded" />
                    </div>
                </div>
                <div className="flex justify-between mt-1">
                    <div className="shrink-0 flex flex-col">
                        <p className="text-xs">
                            {formatDate(new Date(group?.date || ""))}
                        </p>
                        <p className="text-[10px] text-muted">
                            ({formatDaysToWords(diffInDays(group?.date))})
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col text-end">
                        <p className="text-xs">
                            {formatDate(group?.closing_date ?? new Date())}
                        </p>
                        <p className="text-[10px] text-muted">
                            (
                            {formatDaysToWords(diffInDays(group?.closing_date))}
                            )
                        </p>
                    </div>
                </div>
            </div>
            <div className="text-xs bg-muted-faint/40 border border-border rounded p-1 overflow-y-auto flex-1">
                <p>
                    <IconScript className="size-4 inline me-1" />
                    {group?.description}
                </p>
            </div>
        </Card>
    );
};
