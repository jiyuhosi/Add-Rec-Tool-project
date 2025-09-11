import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

// ...existing imports

const MyFormComponent = () => {
    const form = useForm({
        // ...existing form setup
    });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* ...existing form fields */}

            {/* Add employee chat display option when app integration is 'yes' */}
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

interface OptionSectionProps {
    form: UseFormReturn<CompanyFormData>;
}

export const OptionSection: React.FC<OptionSectionProps> = ({ form }) => {
    return (
        <div>
            {/* Existing option fields */}
            
            {/* Employee chat display - show when app integration is 'yes' */}
            {form.watch('appIntegration') === 'yes' && (
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
                                <div className="flex flex-row space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="show"
                                            checked={field.value === 'show'}
                                            onChange={() => field.onChange('show')}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">
                                            {COMPANY_LABEL.OPTIONS.SHOW}
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="hide"
                                            checked={field.value === 'hide'}
                                            onChange={() => field.onChange('hide')}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">
                                            {COMPANY_LABEL.OPTIONS.HIDE}
                                        </span>
                                    </label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};            <button type="submit" className="btn-primary">
                Submit
            </button>
        </form>
    );
};

export default MyFormComponent;