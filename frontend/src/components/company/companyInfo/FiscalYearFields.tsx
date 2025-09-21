import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { COMPANY_LABEL } from '@/constants/companyLabels';
import type { CompanyFormData } from '@/schemas/companySchema';
import { validateFiscalYear } from '@/services/validateYearService';

type Props = { form: UseFormReturn<CompanyFormData> };

export const FiscalYearFields: React.FC<Props> = ({ form }) => {
    const startMonth = parseInt(form.watch('fiscalYearStart') || '0');

    return (
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
            <div className="flex items-center">
                <FormField
                    control={form.control}
                    name="fiscalYearStart"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.FISCAL_YEAR}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                                onValueChange={value => {
                                    field.onChange(value);
                                    const currentEndMonth = parseInt(
                                        form.getValues('fiscalYearEnd') || '0'
                                    );
                                    const newStartMonth = parseInt(value);
                                    if (
                                        currentEndMonth &&
                                        currentEndMonth <= newStartMonth
                                    ) {
                                        form.setValue('fiscalYearEnd', '');
                                    }
                                    setTimeout(
                                        () => validateFiscalYear(form),
                                        0
                                    );
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="border-gray-300">
                                        <SelectValue placeholder="開始月" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Array.from({ length: 11 }, (_, i) => (
                                        <SelectItem
                                            key={i + 1}
                                            value={`${i + 1}`}
                                        >
                                            {i + 1}月
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-center pt-6 px-2">
                    <span className="text-gray-500 text-sm font-medium">
                        ～
                    </span>
                </div>

                <FormField
                    control={form.control}
                    name="fiscalYearEnd"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                &nbsp;
                            </FormLabel>
                            <Select
                                onValueChange={value => {
                                    field.onChange(value);
                                    setTimeout(
                                        () => validateFiscalYear(form),
                                        0
                                    );
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="border-gray-300">
                                        <SelectValue placeholder="終了月" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Array.from(
                                        { length: 12 },
                                        (_, i) => i + 1
                                    ).map((month: number) => (
                                        <SelectItem
                                            key={month}
                                            value={`${month}`}
                                            disabled={
                                                !!startMonth &&
                                                month <= startMonth
                                            }
                                        >
                                            {month}月
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};
