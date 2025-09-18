import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { type CompanyFormData } from '@/schemas/companySchema';
import { COMPANY_LABEL } from '@/constants/companyLabels';
import { PREFECTURES } from '@/constants/prefectures';
import { autoFillAddress } from '@/services/addressService';
import { validateFiscalYear } from '@/services/validateYearService';

interface CompanyInfoProps {
    form: UseFormReturn<CompanyFormData>;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ form }) => {
    const handleAutoFillAddress = () => autoFillAddress(form);

    const getAvailableEndMonths = () => {
        const startMonth = parseInt(form.watch('fiscalYearStart') || '0');
        if (!startMonth) return Array.from({ length: 12 }, (_, i) => i + 1);

        // Return months after the start month (excluding the start month itself)
        return Array.from({ length: 12 }, (_, i) => i + 1).filter(
            month => month > startMonth
        );
    };

    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    {COMPANY_LABEL.SECTIONS.COMPANY_INFO}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.COMPANY_NAME}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS.COMPANY_NAME
                                    }
                                    className="border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyNameKana"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.COMPANY_NAME_KANA}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS.COMPANY_NAME_KANA
                                    }
                                    className="border-gray-300"
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
                    name="companyCode"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.COMPANY_CODE}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS.COMPANY_CODE
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
                                    placeholder={
                                        COMPANY_LABEL.FIELDS.PHONE_NUMBER
                                    }
                                    className="border-gray-300 focus:"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {/* Postal code and auto-fill button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.POSTAL_CODE}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS.POSTAL_CODE
                                    }
                                    className="border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col">
                    <div className="h-6 mb-2"></div>
                    <Button
                        type="button"
                        onClick={handleAutoFillAddress}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-md text-xs px-2 py-1 h-8 w-auto max-w-fit"
                    >
                        {COMPANY_LABEL.BUTTONS.AUTO_FILL_ADDRESS}
                    </Button>
                </div>
            </div>
            {/* Prefecture field with full list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                    control={form.control}
                    name="prefecture"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.PREFECTURE}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="border-gray-300">
                                        <SelectValue placeholder="都道府県を選択" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {PREFECTURES.map(pref => (
                                        <SelectItem
                                            key={pref.code}
                                            value={pref.code}
                                        >
                                            {pref.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.CITY}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={COMPANY_LABEL.FIELDS.CITY}
                                    className="border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {/* Address and building name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.ADDRESS}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={COMPANY_LABEL.FIELDS.ADDRESS}
                                    className="border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="buildingName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {COMPANY_LABEL.FIELDS.BUILDING_NAME}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        COMPANY_LABEL.FIELDS.BUILDING_NAME
                                    }
                                    className="border-gray-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
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
                                        // Reset end month if it's now invalid
                                        const currentEndMonth = parseInt(
                                            form.getValues('fiscalYearEnd') ||
                                                '0'
                                        );
                                        const newStartMonth = parseInt(value);
                                        if (
                                            currentEndMonth &&
                                            currentEndMonth <= newStartMonth
                                        ) {
                                            form.setValue('fiscalYearEnd', '');
                                        }
                                        // Validate when start month changes
                                        setTimeout(
                                            () => validateFiscalYear(form),
                                            0
                                        );
                                    }}
                                    defaultValue={field.value}
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
                                                value={`${String(i + 1).padStart(2, '0')}`}
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
                                        // Validate when end month changes
                                        setTimeout(
                                            () => validateFiscalYear(form),
                                            0
                                        );
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="終了月" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {getAvailableEndMonths().map(month => (
                                            <SelectItem
                                                key={month}
                                                value={`${month}`}
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
        </div>
    );
};
