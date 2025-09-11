import React, { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

interface OccupationalDoctorInfoProps {
    form: UseFormReturn<CompanyFormData>;
}

export const OccupationalDoctorInfo: React.FC<OccupationalDoctorInfoProps> = ({
    form,
}) => {
    const selectedCount = form.watch('occupationalDoctorCount');
    const doctorCount = selectedCount ? parseInt(selectedCount, 10) : 0;
    const currentDoctors = form.watch('occupationalDoctors') || [];

    // Track office code counts for each doctor
    const [officeCodeCounts, setOfficeCodeCounts] = useState<number[]>([]);

    // Debug logs
    console.log('🔍 Debug information:');
    console.log('Selected count (selectedCount):', selectedCount);
    console.log('Converted doctorCount:', doctorCount);
    console.log('Current occupationalDoctors array:', currentDoctors);
    console.log('Current array length:', currentDoctors.length);

    // Initialize array according to selected count
    useEffect(() => {
        // Update only when current array length differs from selected count
        if (doctorCount !== currentDoctors.length) {
            if (doctorCount > 0) {
                const newDoctors = Array.from(
                    { length: doctorCount },
                    (_, index) => {
                        // Keep existing data if available, otherwise create empty object
                        return (
                            currentDoctors[index] || {
                                name: '',
                                nameKana: '',
                                phone: '',
                                responsibleOffice: '',
                                officeCode: '',
                            }
                        );
                    }
                );

                form.setValue('occupationalDoctors', newDoctors, {
                    shouldValidate: false,
                    shouldDirty: false,
                });
            } else {
                console.log('🗑️ Array initialization (empty array)');
                form.setValue('occupationalDoctors', [], {
                    shouldValidate: false,
                    shouldDirty: false,
                });
            }
        }
    }, [doctorCount, currentDoctors.length, form]);

    // Initialize office code counts when doctors change
    useEffect(() => {
        if (doctorCount > 0) {
            setOfficeCodeCounts(prev => {
                const newCounts = Array.from(
                    { length: doctorCount },
                    (_, index) => {
                        return prev[index] || 1; // Default to 1 office code
                    }
                );
                return newCounts;
            });
        } else {
            setOfficeCodeCounts([]);
        }
    }, [doctorCount]);

    const addOfficeCode = (doctorIndex: number) => {
        setOfficeCodeCounts(prev => {
            const newCounts = [...prev];
            if (newCounts[doctorIndex] < 5) {
                newCounts[doctorIndex] = newCounts[doctorIndex] + 1;
            }
            return newCounts;
        });
    };

    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    {COMPANY_LABEL.SECTIONS.OCCUPATIONAL_DOCTOR_INFO}
                </h2>
            </div>

            <FormField
                control={form.control}
                name="occupationalDoctorCount"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel className="text-sm font-medium text-gray-700">
                            {COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_COUNT}
                            <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="border-gray-300 focus:">
                                    <SelectValue
                                        placeholder={
                                            COMPANY_LABEL.FIELDS
                                                .OCCUPATIONAL_DOCTOR_COUNT
                                        }
                                    />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {COMPANY_LABEL.OPTIONS.DOCTOR_COUNT.map(
                                    option => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {doctorCount > 0 && currentDoctors.length > 0 && (
                <div className="space-y-6">
                    {currentDoctors.slice(0, doctorCount).map((_, index) => {
                        return (
                            <div key={index}>
                                <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                                    {
                                        COMPANY_LABEL.SECTIONS
                                            .OCCUPATIONAL_DOCTOR_INFO
                                    }{' '}
                                    {index + 1}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <FormField
                                        control={form.control}
                                        name={`occupationalDoctors.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    {
                                                        COMPANY_LABEL.FIELDS
                                                            .OCCUPATIONAL_DOCTOR_NAME
                                                    }
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={
                                                            COMPANY_LABEL.FIELDS
                                                                .OCCUPATIONAL_DOCTOR_NAME
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
                                        name={`occupationalDoctors.${index}.nameKana`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    {
                                                        COMPANY_LABEL.FIELDS
                                                            .OCCUPATIONAL_DOCTOR_NAME_KANA
                                                    }
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={
                                                            COMPANY_LABEL.FIELDS
                                                                .OCCUPATIONAL_DOCTOR_NAME_KANA
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
                                        name={`occupationalDoctors.${index}.phone`}
                                        render={({ field }) => (
                                            <FormItem className="mb-4">
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    {
                                                        COMPANY_LABEL.FIELDS
                                                            .OCCUPATIONAL_DOCTOR_PHONE
                                                    }
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={
                                                            COMPANY_LABEL.FIELDS
                                                                .OCCUPATIONAL_DOCTOR_PHONE
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
                                        name={`occupationalDoctors.${index}.responsibleOffice`}
                                        render={({ field }) => (
                                            <FormItem className="mb-4">
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    {
                                                        COMPANY_LABEL.FIELDS
                                                            .RESPONSIBLE_OFFICE
                                                    }
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="border-gray-300 focus:">
                                                            <SelectValue
                                                                placeholder={
                                                                    COMPANY_LABEL
                                                                        .FIELDS
                                                                        .RESPONSIBLE_OFFICE
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="office1">
                                                            事業所1
                                                        </SelectItem>
                                                        <SelectItem value="office2">
                                                            事業所2
                                                        </SelectItem>
                                                        <SelectItem value="office3">
                                                            事業所3
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-4 mb-4">
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        {COMPANY_LABEL.FIELDS.OFFICE_CODE}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>

                                    <FormField
                                        control={form.control}
                                        name={`occupationalDoctors.${index}.officeCode`}
                                        render={({ field }) => {
                                            // Ensure officeCode is always an array
                                            const value: string[] =
                                                Array.isArray(field.value)
                                                    ? field.value
                                                    : field.value
                                                      ? [field.value]
                                                      : [];
                                            // Pad or trim to officeCodeCounts[index]
                                            const codes = Array.from(
                                                {
                                                    length:
                                                        officeCodeCounts[
                                                            index
                                                        ] || 1,
                                                },
                                                (_, codeIndex) =>
                                                    value[codeIndex] || ''
                                            );
                                            return (
                                                <div className="space-y-4">
                                                    {codes.map(
                                                        (code, codeIndex) => (
                                                            <FormItem
                                                                key={codeIndex}
                                                                className="w-1/2"
                                                            >
                                                                <FormControl>
                                                                    <Input
                                                                        value={
                                                                            code
                                                                        }
                                                                        onChange={e => {
                                                                            const newCodes =
                                                                                [
                                                                                    ...codes,
                                                                                ];
                                                                            newCodes[
                                                                                codeIndex
                                                                            ] =
                                                                                e.target.value;
                                                                            field.onChange(
                                                                                newCodes
                                                                            );
                                                                        }}
                                                                        placeholder={`${COMPANY_LABEL.FIELDS.OFFICE_CODE} ${codeIndex + 1}`}
                                                                        className="border-gray-300 focus:"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        }}
                                    />

                                    {officeCodeCounts[index] < 5 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        addOfficeCode(index)
                                                    }
                                                    className="flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
