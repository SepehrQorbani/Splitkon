import {
    getLocalTimeZone,
    parseDate,
    today,
    CalendarDate,
} from "@internationalized/date";
import {
    IconCalendar,
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";
import { useTranslations } from "@/hooks/useTranslations";
import {
    Group,
    I18nProvider,
    Label,
    DatePicker as AriaDatePicker,
    DateInput,
    DateSegment,
    Popover,
    Dialog,
    Heading,
    Calendar,
    CalendarGrid,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarGridBody,
    CalendarCell,
} from "react-aria-components";
import { Button } from "./Button";
import { AnimatePresence, motion } from "motion/react";

interface DatePickerProps {
    name: string;
    label?: string;
    value: string | null | undefined;
    onChange: (value: string) => void;
    error?: any;
    isInvalid?: boolean;
}

export default function DatePicker({
    name,
    label,
    value,
    onChange,
    error,
    isInvalid: externalInvalid,
}: DatePickerProps) {
    const { direction, language } = useTranslations();
    const locale = language === "fa" ? "fa-IR-u-ca-persian" : "en-US";
    const isInvalid = externalInvalid || !!error;
    const errorMessage = error?.message ? error.message : undefined;

    let calendarValue: CalendarDate | null;
    try {
        calendarValue = value ? parseDate(value.replace(/T.*/, "")) : null;
    } catch (e) {
        calendarValue = today(getLocalTimeZone());
        onChange(calendarValue.toString());
    }
    const handleChange = (date: CalendarDate | null) => {
        if (date) {
            onChange(date.toString());
        }
    };

    return (
        <AriaDatePicker
            name={name}
            value={calendarValue}
            onChange={handleChange}
            className="w-full relative"
        >
            {label && (
                <Label
                    className={cn(
                        "block text-xs text-text-subtle",
                        isInvalid && "text-error font-medium"
                    )}
                >
                    {label}
                </Label>
            )}
            <I18nProvider locale={locale}>
                <DateField />
                <DatePopover direction={direction} locale={locale} />
            </I18nProvider>

            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs font-medium text-error absolute -bottom-1 end-0 w-full"
                    >
                        <span className="text-xs font-medium text-error absolute end-0">
                            {errorMessage}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </AriaDatePicker>
    );
}

function DateField() {
    return (
        <Group
            className={cn(
                defaultInputClass,
                "flex items-center gap-1 justify-between w-full"
            )}
        >
            <DateInput className="flex-1">
                {(segment) => (
                    <DateSegment segment={segment} className="px-1" />
                )}
            </DateInput>
            <Button
                variant="ghost"
                size="icon"
                className="p-1 focus-visible:ring-0 focus:outline-none"
            >
                <IconCalendar className="size-4" />
            </Button>
        </Group>
    );
}

interface DatePopoverProps {
    direction: "ltr" | "rtl";
    locale: string;
}

function DatePopover({ direction, locale }: DatePopoverProps) {
    return (
        <Popover
            className={cn(
                "w-72 p-2 bg-surface rounded border border-border-input shadow-input",
                "data-[placement=top]:data-[entering]:animate-slide-up-in",
                "data-[placement=bottom]:data-[entering]:animate-slide-down-in",
                "data-[placement=top]:data-[exiting]:animate-slide-down-out",
                "data-[placement=bottom]:data-[exiting]:animate-slide-up-out"
            )}
            style={{ direction }}
        >
            <Dialog>
                <I18nProvider locale={locale}>
                    <Calendar firstDayOfWeek="sat">
                        <CalendarHeader direction={direction} />
                        <CalendarGrid
                            className="w-full table-fixed"
                            weekdayStyle="narrow"
                        >
                            <CalendarGridHeader className="border-b border-border">
                                {(day) => (
                                    <CalendarHeaderCell className="text-muted font-medium text-sm py-2 text-center">
                                        {day}
                                    </CalendarHeaderCell>
                                )}
                            </CalendarGridHeader>
                            <CalendarGridBody>
                                {(date) => (
                                    <CalendarCell
                                        date={date}
                                        className="text-center rounded m-1 cursor-pointer data-[disabled]:text-muted-subtle data-[hovered]:bg-gray-100 data-[selected]:font-medium data-[selected]:bg-action data-[selected]:text-action-fg"
                                    />
                                )}
                            </CalendarGridBody>
                        </CalendarGrid>
                    </Calendar>
                </I18nProvider>
            </Dialog>
        </Popover>
    );
}

interface CalendarHeaderProps {
    direction: "ltr" | "rtl";
}

function CalendarHeader({ direction }: CalendarHeaderProps) {
    return (
        <header
            className={cn(
                "flex gap-2 items-center justify-between py-2",
                direction === "rtl" && "flex-row-reverse"
            )}
        >
            <Button slot="previous" size="sm" variant="ghost" className="p-1">
                <IconChevronLeft className="size-5" />
            </Button>
            <Heading className="text-lg font-semibold" />
            <Button slot="next" size="sm" variant="ghost" className="p-1">
                <IconChevronRight className="size-5" />
            </Button>
        </header>
    );
}
