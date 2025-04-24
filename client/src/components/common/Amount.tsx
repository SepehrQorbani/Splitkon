import { useTranslations } from "@/hooks/useTranslations";

type AmountWrapperProps = { amount: number };

function Amount({ amount }: AmountWrapperProps) {
    const { formatCurrency } = useTranslations();
    const [localeAmount, unit] = formatCurrency(amount);
    return (
        <>
            <span className="text-sm" dir="ltr">
                {localeAmount}
            </span>
            <span className="text-xs ps-1 text-muted">{unit}</span>
        </>
    );
}

export default Amount;
