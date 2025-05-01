import { useTranslations } from "@/hooks/useTranslations";
import { numberToWords } from "@persian-tools/persian-tools";

type AmountWrapperProps = { amount: number; word?: boolean };

function Amount({ amount, word = false }: AmountWrapperProps) {
    const { formatCurrency } = useTranslations();
    const [localeAmount, unit] = formatCurrency(amount);
    return (
        <>
            {word ? (
                <span className="text-xs">
                    {numberToWords(amount)?.toString()}
                </span>
            ) : (
                <span className="text-sm" dir="ltr">
                    {localeAmount}
                </span>
            )}
            <span className="text-xs ps-1 text-muted"> {unit}</span>
        </>
    );
}

export default Amount;
