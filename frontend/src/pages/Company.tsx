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
import { useMutation } from '@apollo/client/react';
import {
    CREATE_COMPANY,
    type CompanyCreateInput,
    type CreateCompanyResult,
} from '@/services/company/createCompany.gql';

const CompanyPage: React.FC = () => {
    const form = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: defaultCompanyFormValues,
    });

    const [createCompany, { loading }] = useMutation<
        CreateCompanyResult,
        { input: CompanyCreateInput }
    >(CREATE_COMPANY);

    const onSubmit = async (data: CompanyFormData) => {
        // Map form values to backend input
        const contactName = `${data.contactPersonLastName}${data.contactPersonFirstName}`;
        const contactNameKana = `${data.contactPersonLastNameKana}${data.contactPersonFirstNameKana}`;
        const fiscalYearEndMonth = String(
            parseInt(data.fiscalYearEnd, 10)
        ).padStart(2, '0');

        const input: CompanyCreateInput = {
            companyName: data.companyName,
            companyNameKana: data.companyNameKana,
            companyCode: data.companyCode,
            contactName,
            contactNameKana,
            phoneNumber: data.phoneNumber || undefined,
            postalCode: data.postalCode,
            location: {
                prefecture: data.prefecture,
                city: data.city,
                streetAddress: data.address,
                addressLine: data.buildingName || undefined,
            },
            fiscalYearEndMonth,
            ownerLoginEmail: data.loginEmail,
            ownerLoginPassword: data.password,
            appIntegrationEnabled: data.appIntegration === 'yes',
            safetyConfirmationEnabled: data.safetyConfirmation === 'yes',
            // true when user selected "yes"
            occupationalDoctorIntegrationEnabled:
                data.occupationalHealthIntegration === 'yes',
            employeeChatEnabled: data.employeeChatDisplay === 'show',
        };

        try {
            const res = await createCompany({ variables: { input } });

            const created = res.data?.createCompany;
            // Consider success if mutation returned an object
            if (created) {
                alert('企業情報が正常に登録されました');
                // Reset all fields back to initial defaults
                form.reset(defaultCompanyFormValues);
            } else {
                throw new Error('Create company failed');
            }
        } catch (error: any) {
            // Surface common backend errors
            const msg =
                error?.message || 'Registration failed. Please try again.';
            console.error('Registration failed:', msg);
        }
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
                {COMPANY_LABEL.PAGE_TITLE}
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, errors => {
                        // Show first validation error if submit is invalid
                        console.log(errors);
                        alert(String('入力内容を確認してください'));
                    })}
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
                            disabled={form.formState.isSubmitting || loading}
                            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-full text-lg font-medium shadow-lg transition duration-200 disabled:opacity-50"
                        >
                            {form.formState.isSubmitting || loading
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
