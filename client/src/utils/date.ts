export const formatDate = (
    locale: string,
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }
) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        console.warn(`Invalid date provided: ${date}`);
        return "Invalid Date";
    }

    try {
        return new Intl.DateTimeFormat(locale, options).format(dateObj);
    } catch (error) {
        console.error(`Error formatting date: ${error}`);
        return "Error Formatting Date";
    }
};

export function diffInDays(
    startDate: string | Date | null | undefined,
    endDate?: string | Date | null
): number {
    if (!startDate) {
        return 0;
    }

    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate
        ? endDate instanceof Date
            ? endDate
            : new Date(endDate)
        : new Date();

    if (isNaN(start.getTime())) {
        return 0;
    }
    if (isNaN(end.getTime())) {
        return 0;
    }

    const timeDifference = end.getTime() - start.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}
