import { Drawer } from "@/components/common/Drawer";
import { useRepayStore } from "@/store";
import RepayDetail, { RepayDetailTitle } from "./RepayDetail";
import { Repay } from "@/types/schemas/repays";

function RepayDetailModal() {
    return (
        <Drawer modalKey="repays">
            {({ data, close }) => {
                const repays = useRepayStore((state) => state.repays);
                let repay = null;
                let isLoading = false;

                if (typeof data === "number" || typeof data === "string") {
                    repay = repays?.find((e) => e.id === +data);
                    isLoading = !repay;
                } else if (typeof data === "object" && data !== null) {
                    repay = data;
                }

                if (!repay) {
                    return {
                        title: <div>404</div>,
                        body: <div></div>,
                    };
                }

                return {
                    isLoading: isLoading,
                    title: (
                        <RepayDetailTitle
                            repay={repay as Repay}
                            onClose={close}
                        />
                    ),
                    body: (
                        <RepayDetail repay={repay as Repay} onClose={close} />
                    ),
                };
            }}
        </Drawer>
    );
}

export default RepayDetailModal;
