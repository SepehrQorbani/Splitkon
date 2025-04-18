import { Repay, RepayInput } from "@/types/schemas/repays";

export type RepayRequest = RepayInput;

export type RepayResponse = {
    data: Repay;
};

export type RepaysResponse = {
    data: Repay[];
};
