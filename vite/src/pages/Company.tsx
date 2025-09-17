import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    companySchema,
    type CompanyFormData,
    defaultCompanyFormValues,
} from '@/schemas/companySchema';
import { COMPANY_LABEL } from '@/constants/companyLabels';
import {
    CompanyInfo,
    OwnerLoginInfo,
    Option,
    EmployeeChatOptions,
} from '@/components/company';

const CompanyPage: React.FC = () => {
    const form = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: defaultCompanyFormValues,
    });

    const onSubmit = async (data: CompanyFormData) => {
        try {
            console.log('Company registration data:', data);
            // TODO: Submit to API
            alert('Company registered successfully!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
                {COMPANY_LABEL.PAGE_TITLE}
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {/* 企業情報セクション */}
                    <CompanyInfo form={form} />

                    {/* オーナーログイン情報セクション */}
                    <OwnerLoginInfo form={form} />

                    {/* オプション選択セクション */}
                    <Option form={form} />

                    {/* 従業員とのチャット オプション選択 */}
                    {form.watch('appIntegration') === 'yes' && (
                        <EmployeeChatOptions form={form} />
                    )}

                    <div className="text-center pt-6">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-full text-lg font-medium shadow-lg transition duration-200 disabled:opacity-50"
                        >
                            {form.formState.isSubmitting
                                ? COMPANY_LABEL.BUTTONS.SUBMITTING
                                : COMPANY_LABEL.BUTTONS.SUBMIT}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CompanyPage;
