import { useTranslations } from "@/hooks/useTranslations";
import InputField from "@/components/common/InputField";
import { AnimatePresence, motion } from "motion/react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { cn } from "@/utils/cn";

type SearchFilterProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

function SearchFilter({
    value,
    onChange,
    placeholder,
    className = "",
}: SearchFilterProps) {
    const { t } = useTranslations();

    return (
        <div className={cn("relative group", className)}>
            <InputField
                label=""
                name="search"
                className=""
                value={value}
                onChange={onChange}
                placeholder=""
                inputClassName="ps-8"
            />
            <span className="absolute start-2 bottom-2 p-1 text-action-soft group-focus-within:text-action">
                <IconSearch className="size-4" />
            </span>
            {value && (
                <AnimatePresence>
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChange("");
                        }}
                        className="absolute end-2 bottom-2 cursor-pointer p-1"
                    >
                        <IconX className="size-4 p-0.5 transition-all border border-action rounded-full text-action hover:bg-action hover:text-action-fg" />
                    </motion.button>
                </AnimatePresence>
            )}
        </div>
    );
}

export default SearchFilter;
