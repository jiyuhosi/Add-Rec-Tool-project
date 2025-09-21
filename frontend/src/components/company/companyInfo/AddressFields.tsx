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
import type { CompanyFormData } from '@/schemas/companySchema';
import { COMPANY_LABEL } from '@/constants/companyLabels';
import { PREFECTURES } from '@/constants/prefectures';
import { autoFillAddress } from '@/services/addressService';

type Props = { form: UseFormReturn<CompanyFormData> };

export const AddressFields: React.FC<Props> = ({ form }) => {
    const handleAutoFillAddress = () => autoFillAddress(form);

    return (
        <>
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
                    <div className="h-6 mb-2" />
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
                                            value={pref.name}
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
        </>
    );
};
