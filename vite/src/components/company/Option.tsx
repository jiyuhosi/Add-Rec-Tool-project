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

interface OptionProps {
    form: UseFormReturn<CompanyFormData>;
}

export const Option: React.FC<OptionProps> = ({ form }) => {
    // アプリ連携の選択値を監視
    const appIntegration = form.watch('appIntegration');

    // アプリ連携が「なし」を選択した場合、安否確認を「なし」に自動設定し、従業員チャットを非表示に設定
    React.useEffect(() => {
        if (appIntegration === 'no') {
            form.setValue('safetyConfirmation', 'no');
            form.setValue('employeeChatDisplay', 'hide');
        }
    }, [appIntegration, form]);

    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    {COMPANY_LABEL.SECTIONS.OPTION}
                </h2>
            </div>

            <FormField
                control={form.control}
                name="appIntegration"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel className="text-sm font-medium text-gray-700">
                            {COMPANY_LABEL.FIELDS.APP_INTEGRATION}
                            <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="yes"
                                        checked={field.value === 'yes'}
                                        onChange={e =>
                                            field.onChange(e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    {COMPANY_LABEL.OPTIONS.YES}
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="no"
                                        checked={field.value === 'no'}
                                        onChange={e =>
                                            field.onChange(e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    {COMPANY_LABEL.OPTIONS.NO}
                                </label>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="safetyConfirmation"
                render={({ field }) => (
                    <>
                        {appIntegration === 'yes' && (
                            <FormItem className="mb-4">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    {COMPANY_LABEL.FIELDS.SAFETY_CONFIRMATION}
                                    <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="yes"
                                                checked={field.value === 'yes'}
                                                onChange={e =>
                                                    field.onChange(
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            {COMPANY_LABEL.OPTIONS.YES}
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="no"
                                                checked={field.value === 'no'}
                                                onChange={e =>
                                                    field.onChange(
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            {COMPANY_LABEL.OPTIONS.NO}
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    </>
                )}
            />

            <FormField
                control={form.control}
                name="occupationalHealthIntegration"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel className="text-sm font-medium text-gray-700">
                            {
                                COMPANY_LABEL.FIELDS
                                    .OCCUPATIONAL_HEALTH_INTEGRATION
                            }
                            <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="yes"
                                        checked={false}
                                        onChange={() => {}}
                                        disabled={true}
                                        className="mr-2 opacity-50 cursor-not-allowed"
                                    />
                                    <span className="text-gray-400">
                                        {COMPANY_LABEL.OPTIONS.YES}
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="no"
                                        checked={field.value === 'no'}
                                        onChange={e =>
                                            field.onChange(e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    {COMPANY_LABEL.OPTIONS.NO}
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
