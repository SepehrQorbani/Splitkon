import { Drawer } from "@/components/common/Drawer";
import { useExpenseStore } from "@/store";
import { ExpenseForm } from "./ExpenseForm";
import { useTranslations } from "@/hooks/useTranslations";
import { IconCashEdit, IconCashPlus, IconX } from "@tabler/icons-react";
import { Button } from "@/components/common/Button";
import { Expense } from "@/types/schemas/expenses";

function ExpenseFormModal() {
    const { t } = useTranslations();

    return (
        <Drawer modalKey="expense-form">
            {({ data, close }) => {
                const expenses = useExpenseStore((state) => state.expenses);
                let isLoading = false;
                let expense;

                if (typeof data === "number" || typeof data === "string") {
                    expense = expenses?.find((e) => e.id === +data);
                    isLoading = !expense;
                } else if (typeof data === "object" && data !== null) {
                    expense = data;
                }

                return {
                    isLoading: data === true ? false : !expenses,
                    title: (
                        <div className="flex items-center justify-between">
                            {data === true ? (
                                <div className="flex gap-1 items-center">
                                    <IconCashPlus className="size-4" />
                                    <span>{t("ui.addExpense")}</span>
                                </div>
                            ) : (
                                <div className="flex gap-1 items-center">
                                    <IconCashEdit className="size-4" />
                                    <span>{t("ui.editExpense")}</span>
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
                            <ExpenseForm
                                onSubmitSuccess={close}
                                expense={
                                    expense && typeof expense === "object"
                                        ? (expense as Expense)
                                        : undefined
                                }
                            />
                        </div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default ExpenseFormModal;
