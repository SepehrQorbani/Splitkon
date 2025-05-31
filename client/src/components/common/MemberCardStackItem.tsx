import { FC } from "react";
import { IconUser } from "@tabler/icons-react";

const MemberCardStackItem: FC = () => {
    return (
        <div className="bg-surface w-full h-full rounded-lg flex flex-col justify-between p-1.5">
            <div className="flex items-center gap-2">
                <IconUser className="size-4 p-0.5 bg-action-faint border border-border rounded" />
                <span className="bg-action-subtle h-1 w-12 rounded"></span>
            </div>
            <span className="bg-action-subtle h-1 w-full rounded"></span>
            <span className="bg-action-subtle h-1 w-full rounded"></span>
        </div>
    );
};

export default MemberCardStackItem;
