import { Drawer } from "@/components/common/Drawer";
import { useRepayStore } from "@/store";
import { RepaysForm } from "./RepayForm";
import { useTranslations } from "@/hooks/useTranslations";
import { IconTransfer, IconX } from "@tabler/icons-react";
import { Button } from "@/components/common/Button";
import { Repay } from "@/types/schemas/repays";

function RepayFormModal() {
    const { t } = useTranslations();

    return (
        <Drawer modalKey="repay-form">
            {({ data, close }) => {
                const repays = useRepayStore((state) => state.repays);
                let repay;
                let isLoading = false;
                let defaultValue;

                if (typeof data === "string" && data.startsWith("from-")) {
                    const match = data.match(
                        /from-(\d+)(?:-to-(\d+)-amount-(\d+))?/
                    );

                    if (match) {
                        const from_id = +match[1];
                        defaultValue = { from_id };
                        if (match[2] !== undefined && match[3] !== undefined) {
                            defaultValue = {
                                from_id,
                                to_id: +match[2],
                                amount: +match[3],
                            };
                        }
                    }
                } else if (
                    typeof data === "number" ||
                    typeof data === "string"
                ) {
                    repay = repays?.find((e) => e.id === +data);
                    isLoading = !repay;
                } else if (typeof data === "object" && data !== null) {
                    repay = data;
                }

                return {
                    isLoading: data === true ? false : isLoading,
                    title: (
                        <div className="flex items-center justify-between">
                            {data === true || defaultValue ? (
                                <div className="flex gap-1 items-center">
                                    <IconTransfer className="size-4" />
                                    <span>{t("ui.addPayment")}</span>
                                </div>
                            ) : (
                                <div className="flex gap-1 items-center">
                                    <IconTransfer className="size-4" />
                                    <span>{t("ui.editRepay")}</span>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                className="size-8 p-1 text-muted"
                                onPress={close}
                            >
                                <IconX className="size-4" />
                            </Button>
                        </div>
                    ),
                    body: (
                        <div className="px-2">
                            <RepaysForm
                                onSubmitSuccess={close}
                                repay={
                                    repay && typeof repay === "object"
                                        ? (repay as Repay)
                                        : undefined
                                }
                                defaultValue={defaultValue}
                            />
                        </div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default RepayFormModal;
