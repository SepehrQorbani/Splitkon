import InputField from "@/components/ui/InputField";
import NumberField from "@/components/ui/NumberField";
import { Controller } from "react-hook-form";
import AvatarSelect from "./AvatarSelect"; // Adjust path as needed
import BankAccountInputField from "./BankAccountInputField";

export const MemberInputFields = ({
    control,
    errors,
    disabled,
    prefix = "", // Optional prefix for nested field names (e.g., "members[0].")
}: {
    control: any;
    errors: any;
    disabled: boolean;
    prefix?: string;
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Controller
                    control={control}
                    name={`${prefix}avatar`}
                    render={({ field }) => (
                        <AvatarSelect
                            name="avatar"
                            value={field.value}
                            onChange={(avatar) => field.onChange(avatar || "")}
                            isRequired
                            isInvalid={!!errors?.avatar}
                            error={errors?.avatar}
                            className="max-w-20 shrink-0"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={`${prefix}name`}
                    render={({ field }) => (
                        <InputField
                            name="name"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={disabled}
                            className="w-full form-field"
                            isRequired
                            isInvalid={!!errors?.name}
                            error={errors?.name}
                        />
                    )}
                />
            </div>
            <div className="flex items-center gap-2 flex-col sm:flex-row">
                <Controller
                    control={control}
                    name={`${prefix}ratio`}
                    render={({ field }) => (
                        <NumberField
                            name="ratio"
                            value={field.value}
                            onChange={field.onChange}
                            minValue={1}
                            maxValue={100}
                            className="w-full sm:w-32 form-field shrink-0"
                            disabled={disabled}
                            isRequired
                            isInvalid={!!errors?.ratio}
                            error={errors?.ratio}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={`${prefix}bank_info`}
                    render={({ field }) => (
                        <BankAccountInputField
                            name="bank_info"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={disabled}
                            isInvalid={!!errors?.bank_info}
                            error={errors?.bank_info}
                        />
                    )}
                />
            </div>
            <div></div>
        </div>
    );
};
