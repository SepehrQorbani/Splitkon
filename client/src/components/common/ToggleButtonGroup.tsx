import { cn } from "@/utils/cn";
import { IconX } from "@tabler/icons-react";
import React from "react";
import {
    ToggleButtonGroup as AriaToggleButtonGroup,
    Key,
    ToggleButton,
} from "react-aria-components";

type ButtonConfig = {
    id: string;
    icon?: React.ReactNode;
};

type Props = {
    buttons: ButtonConfig[];
    value: string | string[] | null;
    onChange: (value: string | string[] | null) => void;
    multiple?: boolean;
    clearable?: boolean;
    className?: string;
};

function ToggleButtonGroup({
    buttons,
    value,
    onChange,
    multiple = false,
    clearable = false,
    className,
}: Props) {
    const selectedKeys = React.useMemo(() => {
        if (!value) return new Set<Key>();
        if (multiple) {
            return new Set<Key>(value as string[]);
        } else {
            return new Set<Key>([value as string]);
        }
    }, [value, multiple]);

    return (
        <div
            className={cn(
                "flex items-center gap-2 p-1 rounded-input border border-border",
                className
            )}
        >
            <AriaToggleButtonGroup
                selectionMode={multiple ? "multiple" : "single"}
                selectedKeys={selectedKeys}
                disallowEmptySelection={!clearable}
                onSelectionChange={(e) => {
                    if (multiple) {
                        onChange([...e] as string[]);
                    } else {
                        onChange([...e][0] as string);
                    }
                }}
                className="flex flex-1 gap-2"
            >
                {buttons.map((button) => (
                    <ToggleButton
                        key={button.id}
                        id={button.id}
                        className={({ isSelected }) =>
                            cn(
                                "inline-flex items-center justify-center px-2 py-1.5 rounded-input focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface/100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors",
                                isSelected
                                    ? "bg-action text-action-fg"
                                    : "text-action hover:bg-action hover:text-action-fg"
                            )
                        }
                    >
                        {button.icon}
                    </ToggleButton>
                ))}
            </AriaToggleButtonGroup>

            {clearable && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (multiple) {
                            onChange([]);
                        } else {
                            onChange(null);
                        }
                    }}
                    disabled={!value}
                    className="rounded-full border border-action text-action hover:bg-action hover:text-action-fg cursor-pointer disabled:text-muted-soft disabled:bg-muted-faint disabled:border-muted-subtle disabled:cursor-not-allowed"
                >
                    <IconX className="size-4 p-0.5 transition-all" />
                </button>
            )}
        </div>
    );
}

export default ToggleButtonGroup;
