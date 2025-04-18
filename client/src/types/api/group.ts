import { z } from "zod";
import { Group, GroupInput, GroupSchema } from "@/types/schemas/group";
import { Members } from "../schemas/members";

export type GroupRequest = GroupInput;

export type GroupResponse = {
    data: Group & { members?: Members };
};
