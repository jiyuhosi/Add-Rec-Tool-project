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

export const ContactPersonFields: React.FC<Props> = ({ form }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                    control={form.control}
                    name="contactPersonLastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.CONTACT_PERSON_LAST_NAME}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS
                                            .CONTACT_PERSON_LAST_NAME
                                    }
                                    className="border-gray-300 focus:"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactPersonFirstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.CONTACT_PERSON_FIRST_NAME}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS
                                            .CONTACT_PERSON_FIRST_NAME
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
                    name="contactPersonLastNameKana"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {
                                    COMPANY_LABEL.FIELDS
                                        .CONTACT_PERSON_LAST_NAME_KANA
                                }
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS
                                            .CONTACT_PERSON_LAST_NAME_KANA
                                    }
                                    className="border-gray-300 focus:"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactPersonFirstNameKana"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {
                                    COMPANY_LABEL.FIELDS
                                        .CONTACT_PERSON_FIRST_NAME_KANA
                                }
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS
                                            .CONTACT_PERSON_FIRST_NAME_KANA
                                    }
                                    className="border-gray-300 focus:"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
};
