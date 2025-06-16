import { cn } from "@/utils/cn";
import Avatar from "./Avatar";
import { Member } from "@/types/schemas/members";

type SimpleMember = {
    id: number | string;
    name: string;
    avatar?: string | null;
};

interface AvatarGroupProps {
    members: Member[] | SimpleMember[];
    size?: "xs" | "sm" | "md" | "lg";
    maxVisible?: number;
    className?: string;
    avatarClassName?: string;
}

function AvatarGroup({
    members,
    size = "sm",
    maxVisible = 3,
    className,
    avatarClassName,
}: AvatarGroupProps) {
    const visibleMembers = members.slice(0, maxVisible);
    const extraCount = members.length - maxVisible;
    const sizeClass = {
        xs: "w-4 h-4",
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <div className="flex -space-x-2">
                {visibleMembers.map((member, index) => (
                    <Avatar
                        key={member.id}
                        src={member?.avatar}
                        alt={member.name}
                        size={size}
                        className={cn(
                            "border-2 border-white rounded-full",
                            avatarClassName
                        )}
                        // style={{ zIndex: visibleMembers.length + index }}
                    />
                ))}
                {extraCount > 0 && (
                    <div
                        className={cn(
                            "flex items-center justify-center rounded-full bg-action text-action-fg text-xs font-medium",
                            sizeClass[size],
                            "border-2 border-white",
                            avatarClassName
                        )}
                        // style={{ zIndex: visibleMembers.length }}
                    >
                        {extraCount}+
                    </div>
                )}
            </div>
        </div>
    );
}

export default AvatarGroup;
