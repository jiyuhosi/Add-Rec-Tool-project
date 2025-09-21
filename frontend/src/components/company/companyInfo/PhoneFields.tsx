import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { COMPANY_LABEL } from '@/constants/companyLabels';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import type { CompanyFormData } from '@/schemas/companySchema';

type Props = { form: UseFormReturn<CompanyFormData> };

export const PhoneFields: React.FC<Props> = ({ form }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                            {COMPANY_LABEL.FIELDS.PHONE_NUMBER}
                            <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder={COMPANY_LABEL.FIELDS.PHONE_NUMBER}
                                className="border-gray-300 focus:"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
