import { Drawer } from "@/components/common/Drawer";
import { useExpenseStore } from "@/store";
import ExpenseDetail, { ExpenseDetailTitle } from "./ExpenseDetail";
import { Expense } from "@/types/schemas/expenses";

type Props = {};

function ExpenseDetailModal({}: Props) {
    return (
        <Drawer modalKey="expenses">
            {({ data, close }) => {
                const expenses = useExpenseStore((state) => state.expenses);
                let expense = null;
                let isLoading = false;
                if (typeof data === "number" || typeof data === "string") {
                    expense = expenses?.find((e) => e.id === +data);
                    isLoading = !expense;
                } else if (typeof data === "object" && data !== null) {
                    expense = data;
                }

                if (!expense) {
                    return {
                        title: <div>عضو یافت نشد</div>,
                        body: <div></div>,
                    };
                }

                if (typeof data === "number" || typeof data === "string") {
                }

                if (!expense) {
                    return {
                        title: <div>عضو یافت نشد</div>,
                        body: <div></div>,
                    };
                }

                return {
                    isLoading: !expenses,
                    title: (
                        <ExpenseDetailTitle
                            expense={expense as Expense}
                            onClose={close}
                        />
                    ),
                    body: (
                        <ExpenseDetail
                            expense={expense as Expense}
                            onClose={close}
                        />
                    ),
                };
            }}
        </Drawer>
    );
}

export default ExpenseDetailModal;
