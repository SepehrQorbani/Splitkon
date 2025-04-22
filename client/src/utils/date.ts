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
