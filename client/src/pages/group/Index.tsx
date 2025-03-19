import { MemberList } from "@/components/ui/MemberList";
import { getGroup, GetGroupResponse } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslations } from "@/hooks/useTranslations";

function Index() {
    const { token } = useParams();
    const { t } = useTranslations();
    const [group, setGroup] = useState<GetGroupResponse["data"] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getGroup(token as string)
            .then((data) => {
                setGroup(data.data);
            })
            .catch((err) => {
                if (err.message.includes("Failed to fetch /api/groups/")) {
                    setError(t("ui.pageNotFound"));
                } else {
                    setError(err?.message);
                }
            });
    }, [token]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!group) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>{group.title}</h1>
            <p>{group.description || t("ui.noDescription")}</p>
            <MemberList
                members={group.members}
                onDeleteMember={(id) => {
                    console.log("Deleted", id);
                }}
                onSelectMember={(id) => {
                    console.log("Selected", id);
                }}
                selectedMember={undefined}
            />
            <p>View Token: {group.view_token}</p>
            <p>Edit Token: {group.edit_token || "Hidden"}</p>
        </div>
    );
}

export default Index;
