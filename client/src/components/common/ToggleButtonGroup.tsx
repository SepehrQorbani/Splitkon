//TODO: fix styles, add variants, fix functionality and ...
import { cn } from "@/utils/cn";
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
    value: string;
    onChange: (value: string) => void;
};

function ToggleButtonGroup({ buttons, value, onChange }: Props) {
    return (
        <AriaToggleButtonGroup
            selectedKeys={new Set<Key>([value])}
            disallowEmptySelection
            className={cn(
                "flex items-center gap-2 p-1 rounded-input border border-border"
            )}
            onSelectionChange={(e) => {
                onChange([...e][0] as string);
            }}
        >
            {buttons.map((button) => (
                <ToggleButton
                    key={button.id}
                    id={button.id}
                    // isDisabled={value === button.id}
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
    );
}

export default ToggleButtonGroup;
