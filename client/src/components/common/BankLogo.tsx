import { getBankInfo } from "@/utils/banks";
import { cn } from "@/utils/cn";
import { IconBuildingBank } from "@tabler/icons-react";

export const BankLogo = ({
    account,
    className,
}: {
    account: string;
    className?: string;
}) => {
    const digits = account.replace(/\D/g, "");
    const bankInfo = digits.length >= 6 ? getBankInfo(digits) : null;

    return (
        <span className={cn(className)}>
            {bankInfo ? (
                <>
                    <img
                        src={`/images/bank-logo/${bankInfo.name}.png`}
                        alt={bankInfo.name}
                        className="w-6 h-6 object-contain"
                    />
                </>
            ) : (
                <>
                    <IconBuildingBank className="w-6 h-6 p-1" />
                </>
            )}
        </span>
    );
};

BankLogo.displayName = "BankLogo";

export default BankLogo;
