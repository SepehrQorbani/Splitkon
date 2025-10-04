import { useTranslations } from "@/hooks/useTranslations";
import { numberToWords } from "@/utils/formats";

type AmountWrapperProps = {
    amount?: number | string;
    word?: boolean;
    placeholder?: string;
    showUnit?: boolean;
};

export default function Amount({
    amount,
    word = false,
    placeholder = "",
    showUnit = true,
}: AmountWrapperProps) {
    const { formatCurrency, locale } = useTranslations();

    const parsedAmount = typeof amount === "string" ? parseInt(amount) : amount;
    if (!parsedAmount || isNaN(parsedAmount)) {
        return <span className="text-xs ps-1 text-muted">{placeholder}</span>;
    }

    const [formattedAmount, unit] = formatCurrency(parsedAmount);
    const displayWord = word
        ? numberToWords(parsedAmount, locale.baseName)
        : null;

    return (
        <>
            {displayWord ? (
                <span className="text-[0.7rem]">{displayWord + " "}</span>
            ) : (
                <span className="text-sm" dir="ltr">
                    {formattedAmount}
                </span>
            )}
            {showUnit && (
                <span className="text-xs ps-1 text-muted">{unit}</span>
            )}
        </>
    );
}
