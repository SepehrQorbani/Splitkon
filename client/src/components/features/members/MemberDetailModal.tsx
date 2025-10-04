import { Drawer } from "@/components/common/Drawer";
import { useMemberStore } from "@/store";
import MemberDetail, { MemberDetailTitle } from "./MemberDetail";
import { Member } from "@/types";

function MemberDetailModal() {
    return (
        <Drawer modalKey="members">
            {({ data, close }) => {
                let member = null;
                let isLoading = false;
                const members = useMemberStore((state) => state.members);

                if (typeof data === "number" || typeof data === "string") {
                    member = members?.find((e) => e.id === +data);
                    isLoading = !member;
                } else if (typeof data === "object" && data !== null) {
                    member = data;
                }

                if (!member) {
                    return {
                        title: <div>عضو یافت نشد</div>,
                        body: <div></div>,
                    };
                }

                return {
                    isLoading: isLoading,
                    title: (
                        <MemberDetailTitle
                            member={member as Member}
                            onClose={close}
                        />
                    ),
                    body: (
                        <MemberDetail
                            member={member as Member}
                            onClose={close}
                        />
                    ),
                };
            }}
        </Drawer>
    );
}

export default MemberDetailModal;
