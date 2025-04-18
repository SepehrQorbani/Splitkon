import { Members } from "../schemas/members";
import { Summary } from "../schemas/summary";

export type SummaryResponse = {
    group: {
        id: number;
        title: string;
    };
    members: Members;
    summary: Summary;
};
