import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import type { CompanyFormData } from '@/schemas/companySchema';
import { COMPANY_LABEL } from '@/constants/companyLabels';

interface EmployeeChatOptionsProps {
    form: UseFormReturn<CompanyFormData>;
}

export const EmployeeChatOptions: React.FC<EmployeeChatOptionsProps> = ({
    form,
}) => {
    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    {COMPANY_LABEL.SECTIONS.EMPLOYEE_CHAT_OPTIONS}
                </h2>
            </div>
            <FormField
                control={form.control}
                name="employeeChatDisplay"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel className="text-sm font-medium text-gray-700">
                            {COMPANY_LABEL.FIELDS.EMPLOYEE_CHAT_DISPLAY}
                            <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={field.value === 'show'}
                                        onChange={e =>
                                            field.onChange(e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    {COMPANY_LABEL.OPTIONS.SHOW}
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={field.value === 'hide'}
                                        onChange={e =>
                                            field.onChange(e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    {COMPANY_LABEL.OPTIONS.HIDE}
                                </label>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
