import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import type { CompanyFormData } from '@/schemas/companySchema';
import { COMPANY_LABEL } from '@/constants/companyLabels';

interface OwnerLoginInfoProps {
    form: UseFormReturn<CompanyFormData>;
}

export const OwnerLoginInfo: React.FC<OwnerLoginInfoProps> = ({ form }) => {
    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    {COMPANY_LABEL.SECTIONS.OWNER_LOGIN_INFO}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                    control={form.control}
                    name="loginEmail"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.LOGIN_EMAIL}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder={
                                        COMPANY_LABEL.FIELDS.LOGIN_EMAIL
                                    }
                                    className="border-gray-300 focus:"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.PASSWORD}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder={COMPANY_LABEL.FIELDS.PASSWORD}
                                    className="border-gray-300 focus:"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};
